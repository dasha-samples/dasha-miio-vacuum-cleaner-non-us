const dasha = require("@dasha.ai/sdk");
const mihome = require("node-mihome");
const fs = require("fs");

// local miIO
mihome.miioProtocol.init();
mihome.miCloudProtocol.login(process.env.MI_USERNAME, process.env.MI_PASSWORD);

const device = mihome.device({
  id: process.env.DEVICE_ID, // required, device id
  model: process.env.MI_MODEL, // required, device model
  address: process.env.DEVICE_IP, // miio-device option, local ip address
  token: process.env.DEVICE_TOKEN, // miio-device option, device token
  refresh: 30000, // miio-device option, device properties refresh interval in ms
});

async function main() {
  const app = await dasha.deploy("./app");

  app.ttsDispatcher = () => "Default";

  app.connectionProvider = async (conv) =>
    conv.input.phone === "chat"
      ? dasha.chat.connect(await dasha.chat.createConsoleChat())
      : dasha.sip.connect(new dasha.sip.Endpoint("default"));

  app.setExternal("startCleaner", async () => {
    console.log("Starting cleaning...");
    await device.init();
    device.setClean();
    return "";
  });

  app.setExternal("stopCleaner", async () => {
    console.log("Returning to dock...");
    await device.init();
    device.setCharge();
    return "";
  });

  app.setExternal("getBattery", async () => {
    await device.init();
    return device.getBattery();
  });

  await app.start();

  const conv = app.createConversation({ phone: process.argv[2] ?? "chat" });

conv.audio.tts = "dasha";

  if (conv.input.phone === "chat") {
    await dasha.chat.createConsoleChat(conv);
  } else {
    conv.on("transcription", console.log);
  }

  const logFile = await fs.promises.open("./log.txt", "w");
  await logFile.appendFile("#".repeat(100) + "\n");

  conv.on("transcription", async (entry) => {
    await logFile.appendFile(`${entry.speaker}: ${entry.text}\n`);
  });

  conv.on("debugLog", async (event) => {
    if (event?.msg?.msgId === "RecognizedSpeechMessage") {
      const logEntry = event?.msg?.results[0]?.facts;
      await logFile.appendFile(JSON.stringify(logEntry, undefined, 2) + "\n");
    }
  });
  
  const result = await conv.execute({
    channel: conv.input.phone === "chat" ? "text" : "audio",
  });
  console.log(result.output);

  await app.stop();
  app.dispose();

  await logFile.close();
}

main();
