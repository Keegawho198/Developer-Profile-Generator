const axios = require("axios");
const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);



async function getGitUser() {
  try {
    const { username } = await inquirer.prompt({
      type: "input",
      message: "Write your GutHub Username",
      name: "username"
    });

    const { data } = await axios.get(
      `https://api.github.com/users/${username}`,
      // `https://api.github.com/users/${username}/starred`
    );

    const { dataStarred } = await axios.get(
        `https://api.github.com/users/${username}/starred`
    );
    console.log(dataStarred);
    const html = generateHTML(username,data,dataStarred);
    await writeFileAsync("index.html", html);
    console.log("index.html written");

    const pdf = generatePDF(username,data,dataStarred);
    await writeFileAsync("index.pdf", pdf);
    console.log("PDF file created");
    
  } catch (err) {
    console.log(err);
  }
}

function generatePDF(username,data) {
  return `
  <img src= ${data.avatar_url}>
  Username: ${username}
  Bio: ${data.bio}
  Location: ${data.location}
  Github Url: ${data.html_url}
  Number of public repositories: ${data.public_repos}
  Number of followers: ${data.followers}
  Number of people following: ${data.following}
  `
}

function generateHTML(username,data,dataStarred) {
  //console.log(data);
  //console.log(username);       <li class="list-group-item">Number of starred ${dataStarred.length}</li>      
  console.log(dataStarred)
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <title>Document</title>
</head>
<body>
  <div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h3>Example heading <span class="badge badge-secondary">Contact Me</span></h3>
    <ul class="list-group">
    <img src= ${data.avatar_url} style="height: 300px; width: 300px;>
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
</html>`
}

getGitUser()

//datastarred not working (always undefined)
//dont know how to add img to pdf