<h1 style="text-align:center">Rcoffee Store App API</h1>
<hr>
<br>

## Built With

![nodejs](https://img.shields.io/badge/Node-JS-green)
![expressjs](https://img.shields.io/badge/ExpressJs-5-blue)

## How to Instal

1.  Npm App

        $ npm init

2.  Clone git repository

        $ git clone https://github.com/RivaldiSiby/Rcoffee-client.git

3.  Open [VS Code](https://code.visualstudio.com/download)
4.  Install package

        npm i express dotenv morgan multer nanoid pg cors joi jsonwebtoken cors cloudinary multer brypt

        npm i eslint nodemon --save-dev

5.  Set .env

        # server configuration
        HOST="HOST"
        PORT="PORT"
        <!-- for publish -->
        # STATUS=production
        <!-- for development -->
        # STATUS=development


        # node-postgres configuration
        DB_USER="USERNAME"
        DB_HOST="HOST"
        DB_PASSWORD="PASS"
        DB_DATABASE="DATABASENAME"
        DB_PORT="PORT"

        #JWT
        JWT_ISSUER=rcoffee
        JWT_SECRET="JWT ACCESS KEY"
        JWT_REFRESH_SECRET="JWT REFRESH KEY"

        <!-- for cloudinary account config -->

        #CLOUDINARY
        CLOUDINARY_NAME="NAME"
        CLOUDINARY_API_KEY="API KEY"
        CLOUDINARY_API_SECRET="API SECRET"

6.  start API APP

        <!-- for start production -->
        $ npm run start

        <!-- for start development -->
        $ npm run startDev

## API END POINT

<table>
<tr>
<th>End Point</th>
<th>Method</th>
<th>Info</th>
</tr>
<tr>
<td>/auth</td>
<td><b>GET</b></td>
<td>Auth</td>
</tr>
<tr>
<td>/users</td>
<td><b>GET</b><br><b>POST</b><br><b>PATCH</b><br><b>DELETE</b><br></td>
<td>Users</td>
</tr>
<tr>
<td>/product</td>
<td><b>GET</b><br><b>POST</b><br><b>PATCH</b><br><b>DELETE</b><br></td>
<td>Product</td>
</tr>
<tr>
<td>/promos</td>
<td><b>GET</b><br><b>POST</b><br><b>PATCH</b><br><b>DELETE</b><br></td>
<td>Promos</td>
</tr>
<tr>
<td>/transaction</td>
<td><b>GET</b><br><b>POST</b><br><b>DELETE</b><br></td>
<td>transaction</td>
</tr>
</table>

## Related Project

[Rcoffee-API](https://github.com/RivaldiSiby/rcoffee-app-client)

## DEPLOYED PROJECT

[Rcoffee-API](https://rcoffee-app.herokuapp.com/product)

[Rcoffee-Store](https://rcofffee-store.netlify.app/)
