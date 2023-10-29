# uploadmate-apis

## Routes and endpoints:

### user routes:
 - to signup : https://uploadmate-api.vercel.app/api/user/signup

 - to login : https://uploadmate-api.vercel.app/api/user/login

 - to get all users : https://uploadmate-api.vercel.app/api/user
 
 - to get one user : https://uploadmate-api.vercel.app/api/user/:id

 - to delete user : https://uploadmate-api.vercel.app/api/user/:id

 - to update user details : https://uploadmate-api.vercel.app/api/user/:id 


### editors routes:
 - to signup : https://uploadmate-api.vercel.app/api/editor/signup

 - to login : https://uploadmate-api.vercel.app/api/editor/login

 - to get all editors : https://uploadmate-api.vercel.app/api/editor
 
 - to get one editor : https://uploadmate-api.vercel.app/api/editor/:id

 - to delete editor : https://uploadmate-api.vercel.app/api/editor/:id

 - to update editor details : https://uploadmate-api.vercel.app/api/editor/:id 


### To add an editor by client

- PUT :  https://uploadmate-api.vercel.app/api/user/addeditor/:userid
 - In body add username, editorname
 

### To add a client by editor
- PUT :  https://uploadmate-api.vercel.app/api/editor/addclient/:editorid
 - In body add username, editorname

### To get all requests
- GET :  https://uploadmate-api.vercel.app/api/requests