
function generateEmailTemplate(subject, content) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  width: 100%;
                  padding: 20px;
                  background-color: #ffffff;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  max-width: 600px;
                  margin: 20px auto;
                  border-radius: 8px;
              }
              .header {
                  background-color: #007BFF;
                  color: #ffffff;
                  padding: 10px 20px;
                  border-radius: 8px 8px 0 0;
                  text-align: center;
              }
              .content {
                  padding: 20px;
              }
              .content h1 {
                  color: #333333;
                  font-size: 24px;
              }
              .content p {
                  color: #666666;
                  line-height: 1.6;
              }
              .footer {
                  text-align: center;
                  padding: 10px 20px;
                  background-color: #f4f4f4;
                  border-top: 1px solid #dddddd;
                  border-radius: 0 0 8px 8px;
              }
              .footer a {
                  color: #007BFF;
                  text-decoration: none;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>${subject}</h1>
              </div>
              <div class="content">
                  ${content}
              </div>
              <div class="footer">
                  <p>&copy; 2024 Ink Military.</p>
                  <p><a href="https://inkmilitary.com">.زيارة الموقع</a> | <a href="https://inkmilitary.com/info">من نحن</a></p>
              </div>
          </div>
      </body>
      </html>
    `;
  }
  
  module.exports = generateEmailTemplate;
  