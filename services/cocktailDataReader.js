import * as fs from "fs/promises";

export const readData = async ()=>{
    const data =  await fs.readFile("./data/cocktails.json","utf8");
    return  JSON.parse(data);
}

export const writeData = async (data)=>{
    await fs.writeFile("./data/cocktails.json",data,"utf8")
}
