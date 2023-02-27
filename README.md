# Blog App
This is an API for a blogging app

---

<!-- Project Shields -->
<div align="center">
  
  [![Contributors][contributors-shield]][contributors-url]
  [![Forks][forks-shield]][forks-url]
  [![Stargazers][stars-shield]][stars-url]
  [![Issues][issues-shield]][issues-url]
  [![MIT License][license-shield]][license-url]
  [![Twitter][twitter-shield]][twitter-url]
</div>

<div>
  <p align="center">
    <a href="https://github.com/moyinoluwa-10/blogger#readme"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://api-shortener.vercel.app/">Demo</a>
    ·
    <a href="https://github.com/moyinoluwa-10/blogger/issues">Report Bug</a>
    ·
    <a href="https://github.com/moyinoluwa-10/blogger/issues">Request Feature</a>
  </p>
</div>

---

## Requirements
1. The user should be able to register 
2. The user should be able to log in with Passport using JWT
3. Implement basic auth
4. Users and non-users should be able to get a blog and a list of published blogs
5. Users should be able to get their blogs
6. Users should be able to create blogs
7. Users should be able to update, publish and delete blogs
8. Test application
---
## Setup
- Install NodeJS, MongoDB
- pull this repo
- update env with [example.env](./example.env)
- run `npm run start:dev`

---
## Base URL
- [Live site](https://bloggerrr.vercel.app/)

## Postman Documentation
- Click [here](https://documenter.getpostman.com/view/23165359/2s8YYFs4R8) to see the documentation


## Models
- User Model
- Blog Model

### User
| field  |  data_type | constraints  |
|---|---|---|
|  id |  string |  required |
|  first_name | string  |  required|
|  last_name  |  string |  required  |
|  username |  string |  required |
|  email     | string  |  required |
|  password |   string |  required  |
|  country |   string |  required  |



### Blog
| field  |  data_type | constraints  |
|---|---|---|
|  id |  string |  required |
|  title | string  |  required |
|  description  |  string |  optional  |
|  body  |  string |  required  |
|  author     | string  |  required |
|  authorID |   string |  required  |
|  state |  string |  required enum: ['draft', 'published'] default: draft  |
|  tags |  string |  optional |
|  read_count |  number |  required |
|  reading_time |  number |  optional |



## APIs
---

### Signup User

- Route: /signup
- Method: POST
- Body: 
```json
{
  "email": "john@example.com",
  "password": "qwerty12",
  "first_name": "john",
  "last_name": "doe",
  "username": "johndoe",
  "country": "nigeria",
}
```

- Responses

Success
```json
{
    "status": true,
    "message": "Signup successful",
    "user": {
          "email": "john@example.com",
          "password": "qwerty12",
          "first_name": "john",
          "last_name": "doe",
          "username": "johndoe",
          "country": "nigeria"
    }
}
```
---
### Login User

- Route: /login
- Method: POST
- Body: 
```json
{
  "email": "john@example.com",
  "password": "qwerty12",
}
```

- Responses

Success
```json
{
    "message": "Login successful",
    "token": "sjlkafjkldsfjsdjkfdnvjkascdjdkcydcjdscdscbdshcduijckjncshbhdscndsbcsdcnsdbcjksdcnsdicbdncbdshcsdcdscnhdcdkscndsjkck"
}
```

---
### Get a list of blogs

- Route: /api/v0/blog
- Method: GET
- Query params: 
    - page (default: 1)
    - per_page (default: 20)
    - order_by (read_count, reading_time, createdAt)
    - order (options: asc | desc, default: desc)
    - title 
    - author 
    - tags

- Responses

Success
```json
{
    "status": true,
    "blogs": [
        {
            "_id": "6366a75b1cd83ae556847ca9",
            "title": "The lazy man",
            "authorID": {
                "_id": "6366a3981cd83ae556847c9a",
                "username": "biodun"
            }
        },
        {
            "_id": "6366b10e74092bfc8be72322",
            "title": "Rising sun",
            "authorID": {
                "_id": "6366a3981cd83ae55684we4",
                "username": "wale"
            }
        }
        {
            "_id": "6366b10e74092bfc8be75a97",
            "title": "The hardworking man",
            "authorID": {
                "_id": "6366a3981cd83ae556847c9a",
                "username": "biodun"
            }
            {
            "_id": "6366b10e74092bfc8be75a97",
            "title": "Independence",
            "authorID": {
                "_id": "6366a3981cd83ae5568436g7",
                "username": "tunde"
            }
        }
        }
    ]
}
```
---

### Get a published blog

- Route: /api/v0/blog/:id
- Method: GET
- Responses

Success
```json
{
    "status": true,
    "blog": {
        "_id": "6366a75b1cd83ae556847ca9",
        "title": "The lazy man",
        "description": "Don'be lazy",
        "body": "A heart touching story of ...",
        "author": "abiodun badmann",
        "authorID": {
            "_id": "6366a3981cd83ae556847c9a",
            "username": "biodun"
        },
        "state": "published",
        "tags": "man lazy",
        "read_count": 1,
        "reading_time": 1,
        "createdAt": "2022-11-05T18:11:39.919Z",
        "updatedAt": "2022-11-05T18:36:51.013Z",
        "__v": 0
    }
}
```
---

### Get a draft blog

- Route: /api/v0/blog/draft/:id
- Method: GET
- Responses

Success
```json
{
    "status": true,
    "blog": {
        "_id": "6366a75b1cd83ae556847ca9",
        "title": "The lazy man",
        "description": "Don'be lazy",
        "body": "A heart touching story of ...",
        "author": "abiodun badmann",
        "authorID": {
            "_id": "6366a3981cd83ae556847c9a",
            "username": "biodun"
        },
        "state": "draft",
        "tags": "man lazy",
        "read_count": 1,
        "reading_time": 1,
        "createdAt": "2022-11-05T18:11:39.919Z",
        "updatedAt": "2022-11-05T18:36:51.013Z",
        "__v": 0
    }
}
```
---

### Get a list of user blogs

- Route: /api/v0/blog/user/:id
- Method: GET
- Header:
    - Authorization: Bearer {token}
- Query params: 
    - page (default: 1)
    - per_page (default: 10)
    - state
  
- Responses

Success
```json
{
    "status": true,
    "blogs": [
        {
            "_id": "6366a75b1cd83ae556847ca9",
            "title": "The lazy man",
            "authorID": {
                "_id": "6366a3981cd83ae556847c9a",
                "username": "biodun"
            }
        },
        {
            "_id": "6366b10e74092bfc8be75a97",
            "title": "The hardworking man",
            "authorID": {
                "_id": "6366a3981cd83ae556847c9a",
                "username": "biodun"
            }
        }
    ]
}
```
---

### Create a blog

- Route: /api/v0/blog
- Method: POST
- Header
    - Authorization: Bearer {token}
- Body: 
```json
{
  "title": "The hare and the tortoise",
  "description": "Madira",
  "body": "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rerum numquam repellendus dicta eligendi consequatur, consectetur sit libero quaerat apsum dolor sit amet consectetur, adipisicing elit. Minus  sint et nihil unde quaerat. Omnis molestiae perferendis repellat praesentium. Impedit ullam similique, libero a minima fugit vero doloremque esse, ad nulla consectetur cupiditate sint nobis quos et tempora possimus vitae, velit autem atque fuga. Vel ",
  "tags": "animal tortoise hare"
}
```

- Responses

Success
```json
{
    "status": true,
    "message": "Blog created successfully",
    "blog": {
        "title": "The hare and the tortoise",
        "description": "Madira",
        "body": "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rerum numquam repellendus dicta eligendi consequatur, consectetur sit libero quaerat apsum dolor sit amet consectetur, adipisicing elit. Minus  sint et nihil unde quaerat. Omnis molestiae perferendis repellat praesentium. Impedit ullam similique, libero a minima fugit vero doloremque esse, ad nulla consectetur cupiditate sint nobis quos et tempora possimus vitae, velit autem atque fuga. Vel ",
        "author": "abiodun badmann",
        "authorID": "6366a3981cd83ae556847c9a",
        "state": "draft",
        "tags": "animal tortoise hare",
        "read_count": 0,
        "reading_time": 1,
        "_id": "6366a5de1cd83ae556847ca5",
         "createdAt": "2022-11-05T18:05:18.681Z",
        "updatedAt": "2022-11-05T18:05:18.681Z",
        "__v": 0
    }
}
```
---

### Update a draft blog

- Route: /api/v0/blog/draft/:id
- Method: PATCH
- Header:
    - Authorization: Bearer {token}
  
- Body: 
```json
{
  "description" : "Don'be lazy",
  "body": "A heart touching story of ..."
}
```
- Responses

Success
```json
{
    "status": true,
    "message": "Draft blog updated successfully",
    "blog": {
        "_id": "6366a75b1cd83ae556847ca9",
        "title": "The lazy man",
        "description": "Don'be lazy",
        "body": "A heart touching story of ...",
        "author": "abiodun badmann",
        "authorID": {
            "_id": "6366a3981cd83ae556847c9a",
            "username": "biodun"
        },
        "state": "draft",
        "tags": "man lazy",
        "read_count": 0,
        "reading_time": 1,
        "createdAt": "2022-11-05T18:11:39.919Z",
        "updatedAt": "2022-11-05T18:36:14.742Z",
        "__v": 0
    }
}
```
---

### Publish a blog

- Route: /api/v0/blog/draft/publish/:id
- Method: PATCH
- Header:
    - Authorization: Bearer {token}
  
- Responses

Success
```json
{
    "status": true,
    "message": "Blog published successfully",
    "blog": {
        "_id": "6366a75b1cd83ae556847ca9",
        "title": "The lazy man",
        "description": "Be hardworking",
        "body": "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rerum numquam repellendus dicta ",
        "author": "abiodun badmann",
        "authorID": {
            "_id": "6366a3981cd83ae556847c9a",
            "username": "biodun"
        },
        "state": "published",
        "tags": "man lazy",
        "read_count": 0,
        "reading_time": 1,
        "createdAt": "2022-11-05T18:11:39.919Z",
        "updatedAt": "2022-11-05T18:13:55.529Z",
        "__v": 0
    }
}
```
---

### Delete a published blog

- Route: /api/v0/blog/:id
- Method: DELETE
- Header:
    - Authorization: Bearer {token}

- Responses

Success
```json
{
    "status": true,
    "message": "Blog deleted successfully"
}
```
---


### Delete a draft blog

- Route: /api/v0/blog/draft/:id
- Method: DELETE
- Header:
    - Authorization: Bearer {token}

- Responses

Success
```json
{
    "status": true,
    "message": "Draft blog deleted successfully"
}
```
---

...

## Contributor
- Moyinoluwa Adelowo


<!-- Markdown Links & Images -->

[contributors-shield]: https://img.shields.io/github/contributors/moyinoluwa-10/blogger.svg?style=for-the-badge
[contributors-url]: https://github.com/moyinoluwa-10/blogger/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/moyinoluwa-10/blogger.svg?style=for-the-badge
[forks-url]: https://github.com/moyinoluwa-10/blogger/network/members
[stars-shield]: https://img.shields.io/github/stars/moyinoluwa-10/blogger.svg?style=for-the-badge
[stars-url]: https://github.com/moyinoluwa-10/blogger/stargazers
[issues-shield]: https://img.shields.io/github/issues/moyinoluwa-10/blogger.svg?style=for-the-badge
[issues-url]: https://github.com/moyinoluwa-10/blogger/issues
[license-shield]: https://img.shields.io/github/license/moyinoluwa-10/blogger.svg?style=for-the-badge
[license-url]: https://github.com/moyinoluwa-10/blogger/blob/main/LICENSE.md
[twitter-shield]: https://img.shields.io/badge/-@rotii_mii-1ca0f1?style=for-the-badge&logo=twitter&logoColor=white&link=https://twitter.com/rotii_mii
[twitter-url]: https://twitter.com/rotii_mii
[javascript]: https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1C
[node]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[express]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[mongodb]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white