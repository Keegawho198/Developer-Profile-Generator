const axios = require("axios");
const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const pdf = require('html-pdf');
const options = { format: 'Letter' };

const writeFileAsync = util.promisify(fs.writeFile);



async function getGitUser() {
  try {
    const { username } = await inquirer.prompt({
      type: "input",
      message: "Write your GutHub Username",
      name: "username"
    });

    const { colorRes } = await inquirer.prompt({
      type: "list",
      message: "Pick a color" ,
      name: "colorRes",
      choices: ["Yellow","Blue","Red","Green"]
    })

    const { data } = await axios.get(
      `https://api.github.com/users/${username}`,
    );
      console.log(data);
    const dataStarred = await axios.get(
        `https://api.github.com/users/${username}/starred`
    );
    const html = generateHTML(username,data,colorRes);
    await writeFileAsync("index.html", html);
    console.log("index.html written");

    console.log("Creating PDF");
    pdf.create(html, options).toFile('./DeveloperProfile.pdf', function(err, res) {
      if (err) return console.log(err);
      // console.log(res); // { filename: '/DeveloperProfile.pdf' }
      console.log("Developer PDF created");
    });
    
  } catch (err) {
    console.log(err);
  }
}

const colorCss = {
  Yellow: {
    container: "#fff8b6"
  }, Blue:{
    container:"#7ac6df"
  }, Red: {
    container: "#d73e3e"
  },Green: {
    container: "#3ed74e"
  }

}


function generateHTML(username,data,colorRes) {
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <title>Developer Profile Generator</title>
  <style>
  .container{
    background-color: ${colorCss[colorRes].container};
  }
  .jumbotron-fluid{
    background-color: ${colorCss[colorRes].container};
  }

</style>
</head>
<body>
  <div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h3>${data.name}</h3>
    <ul class="list-group">
    <img src= ${data.avatar_url} style height= "300px" width= "300px">
      <li class="list-group-item">My GitHub username is ${username}</li>
      <li class="list-group-item">My Location is ${data.location}</li>
      <li class="list-group-item">My GitHub URL is ${data.html_url}</li>
      <li class="list-group-item">My GitHub Bio is ${data.bio}</li>

      <li class="list-group-item">Number of repositories is ${data.public_repos}</li>
      <li class="list-group-item">Number of followers is ${data.followers}</li>
      <li class="list-group-item">Number of people following is ${data.following}</li>
    </ul>
  </div>
</div>
</body>
</html>`;
}

getGitUser()
