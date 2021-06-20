# stocked

### Installation

1. Install [Deno](https://deno.land/)
2. Verify deno installation `deno --version`
3. Install pupeteer browser `PUPPETEER_PRODUCT=chrome deno run -A --unstable https://deno.land/x/puppeteer@9.0.1/install.ts`
4. Create `.env` with `TWILIO_SID` and `TWILIO_AUTH`
5. Run with `deno run -A --config=tsconfig.json --import-map=import_map.json main.ts`

