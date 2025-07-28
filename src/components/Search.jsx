import React from 'react'


//Destructuring search terms
//Just like objects in javascript i.e
// person = {
//     name: 'Bruce Wayne',
//     age: 36,
//     location: 'Gotham City'
// }
//const { name, age, location } = person
//This destructures person object into name, age, location variables
//Thats how the below line works
const Search = ( { searchTerm, setSearchTerm } ) => {
  return (
    <div className="search">
        <div>
            <img src="search.svg" alt="search" />

            <input
                type="text"
                placeholder="Search through thousands of movies"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                />
        </div>
    </div>
  )
}

export default Search