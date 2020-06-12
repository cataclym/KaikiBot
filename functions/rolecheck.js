module.exports = {
    name: "rolecheck",
    description: "check for special role",
    execute(message) {
    const fs = require('fs');   
    const specialString = JSON.parse(fs.readFileSync("./storage/names.json", "utf8"));
    if (message.member.roles.cache.find(r => r.name === specialString.name)) {
      console.log("Role checked:", specialString.name);
      return true;
    }
    return false;
    },
}