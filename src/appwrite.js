import { Client, Databases, ID, Query, } from "appwrite";

const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)

const database = new Databases(client);

//Keep track of what movies are searched for to mark them as popular/trending and update the trending component
//Use appwrite SDK to check if searched term exists in database
//If true, increment count
//If it doesn't, set it to 1
export const updateSearchCount = async (searchTerm, movie) => {
    try {
        //.listDocuments is an Appwrite SDK function that retrieves documents from a specific database collection
        //DATABASE_ID applies the identifier for which database to go into (since we can have multiple databases in appwrite)
        //Once in the database, COLLECTION_ID tells which collection in the database to go into
        //If recalled, when building this project and setting up Appwrite, you make a database 'movies' and that database has an id
        //Then you made a collection in that database which also gives an id 
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            //Goes to Appwrite attributes collection and reads through the key I labelled 'searchTerm' and compares
            //every string in there to searchTerm value passed as 2nd parameter
            Query.equal('searchTerm', searchTerm)
        ])

        //If item does exist already, update the search count
        if(result.documents.length > 0)
        {
            const doc = result.documents[0];

            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {count: doc.count + 1})
        }
        //If it doesn't exist, create it and set it to 1 
        else
        {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            })
        }
    } catch (error) {
        console.log(error);
    }
}

export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc("count"),
        ])
        
        return result.documents;
    } catch (error) {
        console.log(error);
    }
}