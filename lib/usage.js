module.exports.usage = 'Litero \n\
====== \n\
 \n\
Download stories from Literotica.com and save them locally as readable HTML web pages or beautifully formatted Text files, for later reading. \n\
 \n\
Usage \n\
----- \n\
litero_getstory saves the files to whatever directory it is executed.\n\
\n\
	litero_getstory --url "https://www.literotica.com/s/how-to-write-for-literotica" \n\
 \n\
Required Argument \n\
----------------- \n\
 \n\
	-u or --url Pass the URL(link) to the story \n\
 \n\
	litero_getstory --url "https://www.literotica.com/s/how-to-write-for-literotica" \n\
 \n\
 \n\
Optional arguments: \n\
------------------- \n\
	-h or --help Display Help and usage  \n\
 \n\
		e.g. litero_getstory --help \n\
 \n\
	-f or --filename Custom filename for the story to be saved  \n\
 \n\
		e.g. litero_getstory -u "https://www.literotica.com/s/how-to-write-for-literotica" -f "favorite_story" \n\
 \n\
	-e or --format Format of the saved file - Can be html or txt (default)  \n\
 \n\
		e.g. litero_getstory -u "https://www.literotica.com/s/how-to-write-for-literotica" -e html \n\
 \n\
	--verbose - Output all of those annoying messages. \n\
	\n\
		e.g. litero_getstory --verbose -u https://www.literotica.com/s/how-to-write-for-literotica';
