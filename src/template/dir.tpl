<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{title}}</title>
    <style>
        body{
            margin: 30px;
        }
        a {
            display: block;
        }
        #hello::after {
            color: red;
            content: '{{title}}';
        }
    </style>
</head>
<body>
    <div id = "hello"></div>
    {{#each files}}
        <a href="{{../dir}}/{{this}}">{{this}}</a>
    {{/each}}
</body>
</html>
