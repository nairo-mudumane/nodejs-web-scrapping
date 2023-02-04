import { Request, Response } from "express";
import puppeteer from "puppeteer";
import fs from "fs";

export async function instagramController(
  request: Request,
  response: Response
) {
  const { username } = request.params as { username: string };

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.instagram.com/${decodeURI(username)}/`, {
    waitUntil: "networkidle0",
  });

  // client's browser
  const images = await page.evaluate(() => {
    const nodeList = document.querySelectorAll("article img");
    const imagesList = [...nodeList] as HTMLImageElement[];

    return imagesList.map((img, index) => ({
      src: img.src,
      alt: img.alt ?? `${username}'s post ${index + 1}`,
    }));
  });

  fs.writeFileSync(`./uploads/${username}.json`, JSON.stringify(images));

  await browser.close();

  response.setHeader("access-control-allow-origin", "*");
  return response.render("profile", { username, images });
}
