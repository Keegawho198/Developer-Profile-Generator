const axios = require("axios");
const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
// const convertHTMLToPDF = require("pdf-puppeteer");
const pdf = require('html-pdf');
const options = { format: 'Letter' };

// const html = `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <meta http-equiv="X-UA-Compatible" content="ie=edge">
//   <title>Document</title>
// </head>
// <body>
// <h1>Hello World!</h1>
// </body>
// </html>`;
// const options = { format: 'Letter' };

// pdf.create(html, options).toFile('./businesscard.pdf', function(err, res) {
//   if (err) return console.log(err);
//   console.log(res); // { filename: '/app/businesscard.pdf' }
// });

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
      // `https://api.github.com/users/${username}/starred`
    );

    const dataStarred = await axios.get(
        `https://api.github.com/users/${username}/starred`
    );
    //console.log(dataStarred);
    const html = generateHTML(username,data,dataStarred,colorRes);
    await writeFileAsync("index.html", html);
    console.log("index.html written");

    //const pdf = generatePDF(username,data,dataStarred);
    //await writeFileAsync("index.pdf", pdf);
    console.log("PDF file created");
    pdf.create(html, options).toFile('./Test.pdf', function(err, res) {
      if (err) return console.log(err);
      console.log(res); // { filename: '/app/businesscard.pdf' }
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

// function generatePDF(username,data) {
//   return `
//   <img src= ${data.avatar_url}>
//   Username: ${username}
//   Bio: ${data.bio}
//   Location: ${data.location}
//   Github Url: ${data.html_url}
//   Number of public repositories: ${data.public_repos}
//   Number of followers: ${data.followers}
//   Number of people following: ${data.following}
//   `
// }

function generateHTML(username,data,dataStarred,colorRes) {
  //console.log(colorRes)
  //console.log(data);
  //console.log(username);       <li class="list-group-item">Number of starred ${dataStarred.length}</li>      
  //console.log(dataStarred)
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <title>Document</title>
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
    <h3>Example heading <span class="badge badge-secondary">Contact Me</span></h3>
    <ul class="list-group">
    <img src= ${data.avatar_url} style="height: 300px; width: 300px;>
      <li class="list-group-item">My GitHub username is ${username} ${colorRes.colorPallet}</li>
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

// //datastarred not working (always undefined)
// //dont know how to add img to pdf