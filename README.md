# Moviedex API Assignment

This repo contains my Express app to search through movie titles based on user inputs. Query terms are "genre", "country", and "avg_vote". All query filters work alone and in tandem; the avg_vote filter also sorts ratings in descending order when invoked. 

App uses token authentication from environmental variables, is CORS compatible, and use the Helmet package to obfuscate its headers.