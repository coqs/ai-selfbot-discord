const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs'); // Import fs to save the screenshot
const { GoogleGenerativeAI } = require("@google/generative-ai");

const WholeFunction = async () => {
  const genAI = new GoogleGenerativeAI("YOUR-GEMINI-API-KEY-HERE");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  //selenium
  const seleniumTest = async () => {
    let driver;
    try {
      driver = await new Builder().forBrowser('chrome').build();
      await driver.get('https://discord.com/channels/270613445177638922/1198437038068875325');

      // Wait for the email field to be present
      const emailFormDiscord = await driver.wait(until.elementLocated(By.name("email")), 10000);
      await emailFormDiscord.sendKeys("YOUR-DISCORD-EMAIL-HERE");
      
      // Wait for the password field to be present
      const passwordFormDiscord = await driver.wait(until.elementLocated(By.name("password")), 10000);
      await passwordFormDiscord.sendKeys("YOUR-DISCORD-PASSWORD-HERE");

      // Wait for the submit button to be present
      const submitButtonDiscord = await driver.wait(until.elementLocated(By.className("marginBottom8_fd297e button__921c5 button__201d5 lookFilled__201d5 colorBrand__201d5 sizeLarge__201d5 fullWidth__201d5 grow__201d5")), 10000);
      await submitButtonDiscord.click();

      // Wait for the memology server button using aria-label
      //EDIT DATA-LIST-ITEM-ID WITH THE BUTTON/ICON OF THE SERVER THAT YOU WANT TO CHOOSE YOU'LL FIND IT IN DEVTOOLS
      const memologyServerButton = await driver.wait(until.elementLocated(By.css('[data-list-item-id="guildsnav___270613445177638922"]')), 10000);
      await memologyServerButton.click();

      // Wait for general channel
      //EDIT DATA-LIST-ITEM-ID WITH THE GENERAL CHAT COPY IT FROM DEVTOOLS THE BUTTON FOR GENERAL CHAT
      const generalChannelButton = await driver.wait(until.elementLocated(By.css('[data-list-item-id= "channels___1198437038068875325"]')), 10000);
      await generalChannelButton.click();


      const repeatSendMessage = async () => {
        // Get the last Discord message
        const lastMessage = await driver.executeScript(`
          let messages = document.querySelectorAll(".markup__75297.messageContent_c19a55");
          let lastMessage = messages[messages.length - 1];
          return lastMessage ? lastMessage.querySelector("span").innerHTML : null;
        `);

        console.log(lastMessage); // Log the last message

        //YOUR PROMPT
        const prompt = `send a normal discord message all lowercase letter no punctuation obv to look like a human, replying to the following message as if you were in a discord chat: ${lastMessage}`;

        const result = await model.generateContent(prompt);
        console.log(result.response.text());

        // Wait for Discord message input
        const messageInputDiscord = await driver.wait(until.elementLocated(By.className("markup__75297 editor__1b31f slateTextArea_ec4baf fontSize16Padding__74017")), 10000);
        await messageInputDiscord.sendKeys(result.response.text() + Key.ENTER);
      }

      setInterval(() => {
        repeatSendMessage()
      }, 19500);


      // (OPTIONAL) TAKE SCREENSHOT AND SAVE
      const screenshot = await driver.takeScreenshot();
      fs.writeFileSync('screenshot.png', screenshot, 'base64'); // Save the screenshot as a PNG file

    } catch (error) {
      console.log(`found error: ${error}`);
    }
  }

  seleniumTest();
}

WholeFunction();
