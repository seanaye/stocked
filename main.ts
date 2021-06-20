import puppeteer from "puppeteer"
import { fromUint8Array } from "base64"
import { format } from "https://deno.land/std@0.97.0/datetime/mod.ts";

// load dotenv
import "https://deno.land/x/dotenv/load.ts"


const sendTextMessage = async (
  messageBody: string,
  fromNumber: string,
  toNumber: string,
): Promise<Response> => {
  const accountSid = Deno.env.get("TWILIO_SID")
  const authToken = Deno.env.get("TWILIO_AUTH")
  if (!accountSid || !authToken) {
    throw new Error(
      "Your Twilio account credentials are missing. Please add them.",
    );
  }
  const url =
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  const encodedCredentials: string = fromUint8Array(
    new TextEncoder().encode(`${accountSid}:${authToken}`),
  );
  const body: URLSearchParams = new URLSearchParams({
    To: toNumber,
    From: fromNumber,
    Body: messageBody,
  });

  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${encodedCredentials}`,
    },
    body,
  });
};

const url = "https://www.uniqlo.com/ca/en/products/E440676-000?colorCode=COL00&sizeCode=SMA005"
const timestamp = () => format(new Date(), "MM-dd-yyyy HH:mm")

async function main() {
  console.log(timestamp(), ": starting browser", )
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  page.setViewport({height: 1080, width: 1920})
  while (true) {
    await page.goto(url, {
      waitUntil: "networkidle2",
    })
    const outOfStock = await page.evaluate(() => {
      const child = document.querySelector('[data-test=L]')?.firstChild as HTMLInputElement|undefined
      return child?.disabled
    })
    if (!outOfStock) {
      await sendTextMessage(
        `IN STOCK: ${url}`,
        "+16592226096",
        "+15197817839"
      )
      return true
    } else{
      console.log(timestamp(), ": out of stock")
    }
    await new Promise<void>(resolve => setTimeout(() => resolve(), 5000))
  }
}

while (true) {
  try {
    const done = await main()
    if (done) break
  } catch (e) {
    console.error(e)
  }
}

