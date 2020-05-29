"use strict";

const debug = require("debug")("bot-express:skill");
const dialogflow = require("dialogflow");

module.exports = class SkillHumanResponse {

    constructor(){
        this.required_parameter = {
            user: {},
            question: {},
            answer: {
                message_to_confirm: {
                    type: "text",
                    text: "では回答をお願いします。"
                }
            },
            enable_learning: {
                message_to_confirm: {
                    type: "template",
                    altText: "このQ&AをChatbotに学習させますか？（はい・いいえ）",
                    template: {
                        type: "confirm",
                        text: "このQ&AをChatbotに学習させますか？",
                        actions: [
                            {type:"message", label:"はい", text:"はい"},
                            {type:"message", label:"いいえ", text:"いいえ"}
                        ]
                    }
                },
                parser: (value, bot, event, context, resolve, reject) => {
                    //return parser.parse("yes_no", value, resolve, reject);
                    return "";
                },
                reaction: (error, value, bot, event, context, resolve, reject) => {
                    if (error) return resolve();
                    if (value === "いいえ") return resolve();

                    // Create new intent using question and add response using answer.
                    // return dialogflow.add_intent({
                    //     name: context.confirmed.question,
                    //     training_phrase: context.confirmed.question,
                    //     action: "robot-response",
                    //     text_response: context.confirmed.answer
                    // }).then((response) => {
                    //     bot.queue({
                    //         type: "text",
                    //         text: "では新規Q&Aとして追加しておきます。"
                    //     });
                    //     return resolve();
                    // });

                    return resolve();
                }
            }
        }

        this.clear_context_on_finish = (process.env.BOT_EXPRESS_ENV === "test") ? false : true;
    }

    finish(bot, event, context, resolve, reject){
        // Promise List.
        let tasks = [];
        debug("human-response finish");
        // ### Tasks Overview ###
        // -> Reply to administrator.
        // -> Send message to original user.
        let session_client = new dialogflow.SessionsClient({
            project_id: process.env.GOOGLE_PROJECT_ID,
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
            }
        });
        let session_path = sessions_client.sessionPath(process.env.GOOGLE_PROJECT_ID, process.env.GOOGLE_PROJECT_ID);
        const responses = await session_client.detectIntent({
            session: session_path,
            queryInput: {
                text: {
                    text: "できます",
                    languageCode: "ja"
                }
            }
        });
        let jsontext = JSON.stringify(responses);
        debug(`responses 1full:`+jsontext);
        // // -> Reply to administrator.
        // tasks.push(bot.reply({
        //     type: "text",
        //     text: "いただいた内容でユーザーへ返信しておきます。"
        // }));

        // // -> Reply to original user.
        // tasks.push(bot.send(context.confirmed.user.id, {
        //     type: "text",
        //     text: context.confirmed.answer
        // }, context.confirmed.user.language));

        // return Promise.all(tasks).then((response) => {
        //     return resolve();
        // });
        return;
    }
};
