var tempString = `{{
    "_id" : "Homer",
    "books" :
       [
         { "_id" : 7000, "title" : "The Odyssey", "author" : "Homer", "copies" : 10 },
         { "_id" : 7020, "title" : "Iliad", "author" : "Homer", "copies" : 10 }
       ]
  },
  
  {
    "_id" : "Dante",
    "books" :
       [
         { "_id" : 8751, "title" : "The Banquet", "author" : "Dante", "copies" : 2 },
         { "_id" : 8752, "title" : "Divine Comedy", "author" : "Dante", "copies" : 1 },
         { "_id" : 8645, "title" : "Eclogues", "author" : "Dante", "copies" : 2 }
       ]
  }}
`
var tempJson = JSON.parse(tempString);

console.log(tempString + "/n/n" + tempJson);

for(i=0;i<tempJson.books.length;i++)    {
console.log(tempJson.books[i]);
};