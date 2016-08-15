# Litero

Download stories from Literotica ([Literotica.com](http://literotica.com)) and save them locally as readable HTML web pages or beautifully formatted Text files, for later reading.


## Getting Started

Make sure you have [nodejs](http://nodejs.org) installed. Given that, issuing 

```sh
npm install -g litero
```

should do the trick.


### Features

* Download any literotica story URL.
* Get **all the pages** (depagerize) into a single file.
* Plain and simple text files.
* Readable **HTML** page
    * With Color scheme switcher - `Light`,`Dark` and `Sepia`
    * Single page HTML pages, no extra files/ Folder.
    * With link to the original story
    * Link to the Authors submissions.

### Usage

1. From the terminal (command line), issue

    ```sh
    litero_getstory -u 'https://www.literotica.com/s/how-to-write-for-literotica'

    ```

    This will download the story and save it to the file `how-to-write-for-literotica.txt` in the current folder.
    
2. Save the story as a web page (HTML) locally.

    ```sh
    litero_getstory -u 'https://www.literotica.com/s/how-to-write-for-literotica' -e html
    ```
    This will download the story and save it to the file `how-to-write-for-literotica.html` in the current folder. 
    
3. Save the story with custom name and format 

    ```sh
    litero_getstory -u 'https://www.literotica.com/s/how-to-write-for-literotica' -f 'favorite_story' -e html
    ```
    
    This will save the story to a HTML file `favorite_story.html` to the current folder.

4. Just want a text file with custom name? Simply issue,
    
    ```sh
    litero_getstory -u 'https://www.literotica.com/s/how-to-write-for-literotica' -f 'favorite_story' -e txt
    ```


### Examples

Litero comes with much more option flags, that you can pass along the command line.

#### Required
    * `-u` or `--url`  Pass the URL(link) to the story.
      ```sh
      litero_getstory --url 'https://www.literotica.com/s/how-to-write-for-literotica'
      ```
#### Optional
    * `-h` or `--help` Display Help and usage.
      ```sh
      litero_getstory --help
      ```
    * `-f` or `--filename` Custom filename for the story to be saved.
      ```sh
      litero_getstory -u 'https://www.literotica.com/s/how-to-write-for-literotica' -f 'favorite_story'
      ```
    * `-e` or `--format` Format of the saved file - Can be `html` or `txt` (default).
      ```sh
      litero_getstory -u 'https://www.literotica.com/s/how-to-write-for-literotica' -e html
      ```
    * `--verbose` - Output all information going on behind the screens. Useful when something's not working right


### Demo

Demonstration on usage and features. Also featured is the ability to switch reading color schemes ( Light, Dark and Sepia) on saved HTML pages.

![Demo](http://i.giphy.com/l46Cu0MKWI31MOMKc.gif)

P.S. Sorry about the colors though. Here is a **[video version](https://youtu.be/V1fnzfrxAxw)** if you're interested.


### FAQ

1. Can this be used to download individual stories to my computer?
    * Yes.

2. Is this code anyway affiliated to literotica or literotica community?
   * **No**. This software/code is no way affiliated to literotica, any of the authors, or the community. This is merely a work of a fan.

3. Can this be used to rip all the stories in literotica/literotica category? 
    * **No**. Kindly be respectful to the efforts of the authors and literotica.

4. Can you modify this to do `insert some new feature here` that i want?
    * That depends. Drop me a mail, lets figure it out.


### But why?

![But Why?](http://www.reactiongifs.com/r/but-why.gif)

* Coding Fun, Nothing else. 
* Ah. Waitt aaaa minute.. What are you doing here BTW? 
* Actually - It is one of my favorite sites.Being frustated with the site's poorly readable color scheme, I decided to make it pleasant for reading with JS(using greasemonkey) and CSS. When some of my favorite authors took their stories down without warning, This project was born. 


## Acknowledgments

* NodeJS and all modules used.
* Literotica.
* Individual Authors on literotica.


### License

See `LICENSE`
