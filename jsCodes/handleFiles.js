//document.getElementById('loadGame').addEventListener('change', readFile, false);
// todo load game, fill table
/*pdfMake.fonts = {
  NotoSans: {
      normal: 'http://etl.ppp.uoa.gr/sorbet/js-libraries/Noto_Sans/NotoSans-Regular.ttf'

  }
}*/

/* changed! this function modified to load examples */
function openOnlineExample(fname) {
    $("body").css("cursor", "wait");

    //addr = 'http://etl.ppp.uoa.gr/sorbet/';

    if(language==greek) fname+="Gr";
    fpath = 'examples/' + fname + '.js'

    //try loading json, online/localhost only
    $.getJSON(fpath+"on", function(data) {
        //json loaded success
        SorterGame.loadGameFile(data);
        if (autostart) SorterGame.start();
    }).done(function() {

    })
    .fail(function(jqXHR, textStatus, errorThrown) {
    //getJSON request failed, let's load through script

        var script = document.createElement('script');
        script.onload = function() {
            //load the game through script
            SorterGame.loadGameFile(gamejson);
            if (autostart) SorterGame.start(); //added this line to start the game
        };
        script.src = fpath;
        document.head.appendChild(script);

    })
    .always(function() {  });;

    $("body").css("cursor", "default");
}

function readFile(event) {
  var file = event.target.files[0];
  if (!file) {
      alert("Failed to load file");
  } else {
      var r = new FileReader();
      r.onload = function(e) {
          var contents = e.target.result;
          try {
              var loadedJSON = (JSON.parse(contents))
              console.log(loadedJSON);
              SorterGame.loadGameFile(loadedJSON);
          } catch (e) {
              //oldFilesRead (contents)
          }


      }
      r.readAsText(file);
  }
}

function downloadScore() {

  var playAnswers = SorterGame.getPlayAnswers();
  var scoreModal = document.getElementById("score-modal");
  var categories = [];
  var answers = [];
  for (var i = 0; i < SorterGame.categories.length; i++) {
      categories.push(SorterGame.categories[i].text)
  }
  categories.push(language.classUncl)

  /*
  for (var i = 0; i < playAnswers.length; i++) {
      var answer = [];
      for (var j = 0; j < playAnswers[i].answers.length; j++) {
          if (playAnswers[i].answers[j].type == "text") {
              answer.push( playAnswers[i].answers[j].text);
          } else if (playAnswers[i].answers[j].type == "img") {
            answer.push({image:playAnswers[i].answers[j].uri,
                        width:90, height:90});
          }
      }
      answers.push(answer)
  }
  */
// debugger;
    playAnswers=playAnswers.map((answer)=>Object.values(answer));
    playAnswers=playAnswers.map((answer)=>{answer[1]=answer[1].map((obj)=>{
        if(obj.type =="text"){
            return([ obj.text, obj.correct.toString()]);
          }
          else {
            /*thumbnail = document.createElement("img");
            thumbnail.src = this.playAnswers[i].answers[j].uri;
            thumbnail.style.width = "40px"
            thumbnail.style.height = "40px"
            */
           return (([{image:obj.uri,
                width:90, height:90}, obj.correct.toString()]))
          }
    }); return answer});
    playAnswers.unshift([language.category, language.classifObj]);



  var dd = {
      content: [
          {
              text: scoreModal.innerText,
              style: 'subheader'
          },
          {
            text:language.classtable,
              style: 'subheader'
          },
          {
              style: 'tableExample',
              table: {
                  body:

                      playAnswers
                      //document.getElementById("playAnswersTable").tBodies[0]

              }
          },

      ],
      styles: {
          header: {
              fontSize: 18,
              //	bold: true,
              margin: [0, 0, 0, 10]
          },
          subheader: {
              fontSize: 16,
              //bold: true,
              margin: [0, 10, 0, 5]
          },
          tableExample: {
              margin: [0, 5, 0, 15]
          },
          tableHeader: {
              //	bold: true,
              fontSize: 13,
              color: 'black'
          }
      },
      defaultStyle: {
          //font: 'NotoSans'
      }

  }
  console.log(playAnswers);

  //console.log(dd);
  pdfMake.createPdf(dd).download();
}

SorterGame.prototype.loadGameFile = function(contents /*, source*/) {
    fromLaunch = false;

 // if (source == 2) {
		//extendt2 platform, but we move away from that complexity and make the two one
		this.gameObjects = JSON.parse(contents.gameObjects);
		this.categories = JSON.parse(contents.categories);
		fromLaunch = true;
//	} else {
		this.gameObjects = contents.gameObjects;
		this.categories = contents.categories;
	//}

    /*this.gameObjects = contents.gameObjects;
    this.categories = contents.categories;*/
    this.loadData();
    this.saveGame();
    this.loadPlayMode();
}

/*
SorterGame.prototype.loadGame = function () {
}
*/


/*
    This file is part of "ChoiCo" a web application for designing digital games, written by Marianthi Grizioti for the National and Kapodistrian University of Athens (Educational Technology Lab).
    Copyright (C) 2017-2018.
    ChoiCo is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ChoiCo is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/
function loadXml (fileName) {
    return new Promise ((resolve,reject)=> {

      var jqxhr = $.get(fileName).done (function(result){
      var serializer = new DOMParser();//XMLSerializer();
      console.log (fileName + ' loaded successfully')
      var xml = serializer./*serializeToString*/parseFromString(result, "text/xml").firstChild;
      resolve (xml)
    })
    .fail (function(){console.log (fileName + ' failed to load'); reject('error')})
  });
  }

function loadImgFile(evt) {

  //Retrieve the first (and only!) File from the FileList object
  var f = evt.target.files[0];
  var rowNumber = this.parentNode.parentNode.rowIndex;
  var thumb = this.nextElementSibling;
  if (!f) {
      alert("Failed to load file");
  } else {
      var r = new FileReader();
      r.onload = function(e) {
          var uri = e.target.result;
          /*var id =   parseInt(SorterGame.dataTable.tBodies[0].rows[rowNumber].cells[0].innerHTML)
   var newImg = {id: id, imguri: uri}
   var img = myGame.images.find(x=>x.id === id)
   if (img!= undefined)  //image already uploaded for this
    img.imguri = uri;
    else
   SorterGame.images.push(newImg);*/
          thumb.src = uri
      }
      r.readAsDataURL(f);
  }
}
