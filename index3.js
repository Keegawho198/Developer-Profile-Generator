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

    // const { dataStarred } = await axios.get(
    //     `https://api.github.com/users/${username}/starred`
    // );

    console.log("Number of Public repositories: " + data.public_repos);
    const html = generateHTML(username,data);
    await writeFileAsync("index.html", html);
    
  } catch (err) {
    console.log(err);
  }
}

function generateHTML(username,data) {
  console.log(data);
  console.log(username);
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
      <li class="list-group-item">My GitHub username is ${username}</li>
      <li class="list-group-item">My GitHub username is ${data.bio}</li>
    </ul>
  </div>
</div>
</body>
</html>`
}

getGitUser()
