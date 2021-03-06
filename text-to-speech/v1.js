/**
 * Copyright 2014 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var pick           = require('object.pick');
var extend         = require('extend');
var requestFactory = require('../lib/requestwrapper');
var util = require('util');
var BaseService = require('../lib/base_service');

/**
 *
 * @param options
 * @constructor
 */
function TextToSpeechV1(options) {
  BaseService.call(this, options);
}
util.inherits(TextToSpeechV1, BaseService);
TextToSpeechV1.prototype.name = 'text_to_speech';
TextToSpeechV1.prototype.version = 'v1';
TextToSpeechV1.URL = 'https://stream.watsonplatform.net/text-to-speech/api';

/**
 * Streaming speech synthesis of the text in a query parameter
 *
 * @param {Object} options
 * @param {String} options.text
 * @param {String} [options.voice]
 * @param {String} [options.accept]
 * @param {Boolean} [options.X-Watson-Learning-Opt-Out]
 * @param {Function} callback
 */
TextToSpeechV1.prototype.synthesize = function(params, callback) {
  params = extend({accept:'audio/ogg; codecs=opus'}, params);
  if (!params.text){
    callback(new Error('Missing required parameters: text'));
    return;
  }

  var parameters = {
    options: {
      method: 'POST',
      url: '/v1/synthesize',
      body: JSON.stringify(pick(params, ['text'])),
      qs: pick(params, ['accept', 'voice']),
      headers: extend({
        'content-type': 'application/json'
      }, pick(params, ['X-Watson-Learning-Opt-Out'])),
      encoding: null
    },
    defaultOptions: this._options
  };
  return requestFactory(parameters, callback);
};

/**
 * Retrieves the voices available for speech synthesis
 */
TextToSpeechV1.prototype.voices = function(params, callback) {
  var parameters = {
    options: {
      method: 'GET',
      url: '/v1/voices',
      json: true
    },
    defaultOptions: this._options
  };
  return requestFactory(parameters, callback);
};

/**
 * new customization features


Summary of API calls


API Number 	Method 	API URL 	Description
API-01 	POST 	/api/v1/customizations 	Create new custom model
API-02 	GET 	/api/v1/customizations?language="en-US" 	List custom models for a language
API-03 	DELETE 	/api/v1/customizations/{customization_id}  	Delete custom model
API-04 	GET 	/api/v1/customizations/{customization_id}?<alphabet=spr> 	Query contents of custom model (optionally converts IPA to SPR phones)
API-05 	POST 	/api/v1/customizations/{customization_id} 	Update contents of custom model, including adding one or more words
API-06 	PUT 	/api/v1/customizations/{customization_id}/words/{word} 	Add a single word to custom model
API-07 	POST 	/api/v1/customizations/{customization_id}/words 	Add one or more words to custom model
API-08 	GET 	/api/v1/customizations/{customization_id}/words/{word} 	Query details for a word in custom model
API-09 	GET 	/api/v1/customizations/{customization_id}/words 	List contents of words in custom model
API-10 	DELETE 	/api/v1/customizations/{customization_id}/words/{word} 	Delete single word from custom model
API-11 	GET 	/api/v1/pronunciation?text=aword&voice=voiceModel&format=ipa|spr 	Gets the IPA (or optionally the SPR) pronunciation of a given word for a given voice model (default=en-US_MichaelVoice)

 TTS API Implementation
*/

/*


 Create Custom Voice Model

 Creates a new custom voice model for the specified language.  Note: not all languages are supported (only US English for Beta release).

 API:

 POST /text-to-speech/api/v1/customizations

 example: http://9.186.107.61:9080/text-to-speech/api/v1/customizations

 https://stream-d.watsonplatform.net/text-to-speech/api/v1/customizations

 Request:

 {

         "name":"my custom voice",

         "language":"en-US",

         "description":"This is my first custom voice"

 }

 Input:

 name -- string, not null. Voice model name;

 language -- string, null/not null. If language is null, default is en-US .

 description -- string, null/not null. Description of the custom voice model.

 Output:

 If success  --

 {

               "customization_id":"74f4807e-b5ff-4866-824e-6bba1a84fe96"

 }

 Here 74f4807e-b5ff-4866-824e-6bba1a84fe96 is the UUID of new voice model.

 If failed --

 {

              "code":400,

              "error":"Invalid value for 'language'.",

              "code_description":"Bad Request"

 }



 Http Status Code:

 HTTP Code


 Notes

 200 Success

 400 Invalid parameter 'parameter-name' in request.
 400 	Required parameter 'parameter-name' is missing.
 400 	This 'language' is currently not supported.

 500 Service internal error

*/
TextToSpeechV1.prototype.createCustomizations = function(params, callback) {
  var parameters = {
    options: {
      method: 'POST',
      url: '/v1/customizations',
      body: JSON.stringify(pick(params, ['text'])),
      qs: pick(params, ['accept', 'voice']),
      headers: extend({
        'content-type': 'application/json'
      }, pick(params, ['X-Watson-Learning-Opt-Out'])),
      json: true
    },
    defaultOptions: this._options
  };
  return requestFactory(parameters, callback);
};

/*

 List Custom Voices

 List all available custom voice models for a language (or all languages).

 API:

 GET /text-to-speech/api/v1/customizations?language="en-US"

 example: http://9.186.107.61:9080/text-to-speech/api/v1/customizations?language=en-US

 https://stream-d.watsonplatform.net/text-to-speech/api/v1/customizations?language=en-US

 Request: empty body

 Input:

 language -- string, null/not null. If it is null, API returns all custom voice models owned by the requester (based on bluemix-instance-id); if it's not null, returns custom voice models for this specified language id owned by the requester;

 Output:

 If success  --

 {

              "customizations":[

                                       {

                                                "customization_id":"1fa3b971-45ad-4da5-a2a0-019d6eb24227",

                                                "created":1432114231877,

                                                 "language":"en-US",

                                                 "owner":"GUID",

                                                 "name":"Lorem sit amet",

                                                 "description":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae officiis similique consequuntur rem cumque rerum ex qui quo odio eligendi quia, consequatur quos suscipit id inventore itaque est aliquid! Temporibus reiciendis debitis tempore distinctio excepturi voluptate consequatur, iste illum dicta, voluptatibus alias doloribus quaerat fugiat eius odit magnam voluptatum officia."

                                       }

                                       ]

 }

 Here 'customizations' is a list of custom voice models, 'owner' is a GUID which associates the user with the custom model, 'created' is Unix-time of when the model was created, 'customization_id' is a GUID associated with the custom model and 'language' is the language of the model.



 If failed --

 {
              "code":400,
              "error":"Invalid value for 'language'.",
              "code_description":"Bad Request"
 }

 Http Status Code:

 HTTP Code


 Notes

 200


 Success

 400


 Invalid value for 'language'.

 500


 Service internal error



 Testing case:

 http://9.186.107.61:9080/text-to-speech/test/tts/ListDictionaries.html



 Delete Custom Voice Model

 Delete a custom voice model.

 API:

 DELETE  /text-to-speech/api/v1/customizations/{customization_id}

 example: http://9.186.107.61:9080/text-to-speech/api/v1/customizations/74f4807e-b5ff-4866-824e-6bba1a84fe96

 https://stream-d.watsonplatform.net/text-to-speech/api/v1/customizations/74f4807e-b5ff-4866-824e-6bba1a84fe96



 Request: empty body

 Input:

 customization_id -- UUID string, not null.

 Output:

 If success  --

 Empty body



 If failed --

 {

              "code":401,

              "error":"Invalid customization_id (XXX) for user.",

              "code_description":Unauthorized"

 }



 Http Status Code:

 HTTP Code


 Notes

 204


 Success

 400


 Invalid value for 'customization_id'.
 401 	Invalid customization_id  (xxx) for user

 500


 Service internal error



 Testing case:

 http://9.186.107.61:9080/text-to-speech/test/tts/DeleteDictionary.html



 Query Custom Voice Model

 List contents of custom voice model.

 API:

 GET  /text-to-speech/api/v1/customizations/{customization_id}?<alphabet=spr>

 example: http://9.186.107.61:9080/text-to-speech/api/v1/customizations/74f4807e-b5ff-4866-824e-6bba1a84fe96

 https://stream-d.watsonplatform.net/text-to-speech/api/v1/customizations/74f4807e-b5ff-4866-824e-6bba1a84fe96



 Request: empty body

 Input:

 customization_id -- GUID string, not null.

 alphabet -- an optional query parameter which tells system to return original pronunciation or if set to "spr", pronunciations after conversion to SPR phoneme set (this is needed by TTS engine).  Only words with phonetic pronunciations are converted to SPR (so sounds-like remain as sounds-like)

 Output:

 If success  --

 {

                                    "customization_id":"7524b592-aeb5-4ab3-a3a6-639dfc4eaf4b",

                                    "created":1432021460585,

                                    "language":"en-US",

                                    "owner":GUID,

                                    "name":"Lorem ipsum dolor",

                                    "last_modified":1439955282335,

                                    "description":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus amet assumenda nostrum ea, nesciunt veniam voluptates. Sapiente labore accusamus illum placeat voluptatem, architecto repellat fugit blanditiis velit in esse vitae, necessitatibus ducimus nobis? Natus accusantium maiores corporis ipsam praesentium, totam iusto minus temporibus sapiente, aperiam, id ullam vero adipisci accusamus.",

                                   "words": [

                                               {"word":"gastroenteritis", "translation":"`[1gAstroEntxrYFXs]"},

                                               {"word": "trinitroglycerin", "translation":"try nitro glycerin"},

                                               {"word":"div.", "translation":"division"},

                                               {"word": "proc.", "translation":"proceedings"]

 }



 Here 'words' is a list of the words in the custom model, 'owner' is a GUID which associates the user with the custom model, 'created' is Unix-time of when the model was created, 'last_modified' is Unix-time of when the model was last modified, 'customization_id' is a GUID associated with the custom model and 'language' is the language of the model.



 If failed --

 {

              "code":401,

              "error":"Invalid customization_id (XXX) for user.",

              "code_description":Unauthorized"

 }



 Http Status Code:

 HTTP Code


 Notes

 200


 Success

 400


 Invalid value for 'customization_id'.
 401 	Invalid customization_id  (xxx) for user.

 500


 Service internal error
 304 	Not modified



 Testing case:

 http://9.186.107.61:9080/text-to-speech/test/tts/QueryDictionary.html





 Update Custom Voice

 Update custom voice information (name or description). Can also be used to add one or more words to the dictionary.

 API:

 POST /text-to-speech/api/v1/customizations/{customization_id}

 example: http://9.186.107.61:9080/text-to-speech/api/v1/customizations/74f4807e-b5ff-4866-824e-6bba1a84fe96

                https://stream-d.watsonplatform.net/text-to-speech/api/v1/customizations/74f4807e-b5ff-4866-824e-6bba1a84fe96



 Request:

 {

 "name":"new voice name",

 "description":"This is my new custom voice",

 "words": [

     {"word":"gastroenteritis", "translation":"<phoneme alphabet="ibm" ph="1gAstroEntxrYFXs"></phoneme>"},

     {"word":"tomato", "translation":"<phoneme alphabet="ipa" ph="təmˈɑto"></phoneme>"},

     {"word": "trinitroglycerin", "translation":"try nitro glycerin"},

     {"word":"div.", "translation":"division"},

     {"word": "proc.", "translation":"proceedings"}]

 }

 Input:

 customization_id -- UUID string, not null.

 name -- string, null/not null. If it's null, voice name field will not be updated.

 description -- string, null/not null. If it's null, description field will not be updated.

 words -- a JSON array composed of 'word' objects. If array is empty, word entries will not be updated.

 word  -- a JSON object composed of "word":"word_string" and "translation":"pronunciation|sounds-like string".  The format for the pronunciation is based on the SSML format for representing the phonetic string of a word.  That is, "<phoneme alphabet="ipa" ph="təmˈɑto"></phoneme>" for adding an IPA pronunciation or "<phoneme alphabet="ibm" ph="1gAstroEntxrYFXs"></phoneme>" for adding an SPR pronunciation.  SPR is the native IBM phone set.



 Output:

 If success  --

 Empty body



 If failed --

 {

               "code":401,

               "error":"Invalid customization_id (XXX) for user.",

               "code_description":Unauthorized"

 }



 Http Status Code:

 HTTP Code


 Notes

 201


 Success
 400 	Invalid parameter 'parameter-name' in request.

 400


 Invalid value for 'customization_id'.
 400 	In SSML: <phoneme alphabet="ipa" ph="XXX"></phoneme>, attribute 'ph' is not a standard IPA format.
 401 	Invalid customization_id  (xxx) for user.

 500


 Service internal error



 Testing case:

 http://9.186.107.61:9080/text-to-speech/test/tts/UpdateDictionary.html



 Update Custom Voice Word

 Adds a single word to a given customization_id

 API:

 PUT /text-to-speech/api/v1/customizations/{customization_id}/words/{word}

 example: http://9.186.107.61:9080/text-to-speech/api/v1/customizations/74f4807e-b5ff-4866-824e-6bba1a84fe96/words/aword

                https://stream-d.watsonplatform.net/text-to-speech/api/v1/customizations/74f4807e-b5ff-4866-824e-6bba1a84fe96/words/aword



 Request:

 {

             "translation":"pronunciation|sounds-like"
 }

 Input:

 word -- string, containing word to add

 translation - a valid IPA or SPR pronunciation and/or one or more words which when combined sound like the word being added - the pronunciation should be in SSML format, e.g. "<phoneme alphabet="ipa" ph="təmˈɑto"></phoneme>" for adding an IPA pronunciation or "<phoneme alphabet="ibm" ph="1gAstroEntxrYFXs"></phoneme>" for adding an SPR pronunciation.  SPR is the native IBM phone set.





 Output:

 If success  --

 Empty body



 If failed --

 {

              "code":401|400,400,

              "error":"Invalid customization_id (XXX) for user" | "Invalid request" | "In SSML: <phoneme alphabet="ipa" ph="XXX"></phoneme>, attribute 'ph' is not a standard IPA format.",

              "code_description":Unauthorized"|"Bad Request"|"Bad Request"

 }



 Http Status Code:

 HTTP Code


 Notes

 201


 Success
 400 	Invalid parameter 'parameter-name' in request.

 400


 Invalid value for 'customization_id'.
 400 	In SSML: <phoneme alphabet="ipa" ph="XXX"></phoneme>, attribute 'ph' is not a standard IPA format.

 401


 Invalid customization_id  (xxx) for user.

 500


 Service internal error



 Testing case:

 http://9.186.107.61:9080/text-to-speech/test/tts/UpdateDictionaryWord.html



 Update Custom Voice Words

 Adds one or more words and their associated pronunciation to a given customization_id

 API:

 POST /text-to-speech/api/v1/customizations/{customization_id}/words

 example: http://9.186.107.61:9080/text-to-speech/api/v1/customizations/74f4807e-b5ff-4866-824e-6bba1a84fe96/words

                https://stream-d.watsonplatform.net/text-to-speech/api/v1/customizations/74f4807e-b5ff-4866-824e-6bba1a84fe96/words



 Request:

 {

 "words": [

     {"word":"gastroenteritis", "translation":"<phoneme alphabet="ibm" ph="1gAstroEntxrYFXs"></phoneme>"},

     {"word": "trinitroglycerin", "translation":"try nitro glycerin"},

     {"word":"div.", "translation":"division"},

     {"word": "proc.", "translation":"proceedings"]

 }



 Input:

 words -- JSON array of JSON tuples containing word and translation objects

 word -- string,containing word to add

 translation - valid IPA pronunciation and/or one or more words which when combined sound like the word being added



 Output:

 If success  --

 Empty body



 If failed --

 {

              "code":401|400,400,

              "error":"Invalid customization_id (XXX) for user" | "Invalid request" | "In SSML: <phoneme alphabet="ipa" ph="XXX"></phoneme>, attribute 'ph' is not a standard IPA format.",

              "code_description":Unauthorized"|"Bad Request"|"Bad Request"

 }



 Http Status Code:



 HTTP Code


 Notes

 201


 Success

 400


 Invalid value for 'customization_id'.
 400 	Invalid parameter 'parameter-name' in request.
 400 	In SSML: <phoneme alphabet="ipa" ph="XXX"></phoneme>, attribute 'ph' is not a standard IPA format.

 401


 Invalid customization_id  (xxx) for user.

 500


 Service internal error



 Testing case:

 http://9.186.107.61:9080/text-to-speech/test/tts/UpdateDictionaryWords.html



 Get Word

 Get details for a single word belonging to customization_id

 API:

 GET /text-to-speech/api/v1/customizations/{customization_id}/words/{word}

 example: http://9.186.107.61:9080/text-to-speech/api/v1/customizations/74f4807e-b5ff-4866-824e-6bba1a84fe96/words/aword

                https://stream-d.watsonplatform.net/text-to-speech/api/v1/customizations/74f4807e-b5ff-4866-824e-6bba1a84fe96/words/aword



 Request:

 {

 }

 Input:

 word -- string,containing word to add



 Output:



 If success  --

 {

               "translation":"pronunciation|sounds-like"

 }

 If failed --

 {

              "code":400,

              "error":"Word: <aword> not found in customization_id: XXX",

              "code_description":"Bad Request"

 }



 Http Status Code:

 HTTP Code


 Notes

 200


 Success

 400


 Invalid value for 'customization_id'.
 400 	Word: xxx not found in customization_id: xxx-xxx

 401


 Invalid customization_id  (xxx) for user.

 500


 Service internal error



 Testing case:

 http://9.186.107.61:9080/text-to-speech/test/tts/GetWord.html



 Get Words

 List all the words associated with a customization_id



 API:

 GET /text-to-speech/api/v1/customizations/{customization_id}/words

 example: http://9.186.107.61:9080/text-to-speech/api/v1/customizations/74f4807e-b5ff-4866-824e-6bba1a84fe96/words

                https://stream-d.watsonplatform.net/text-to-speech/api/v1/customizations/74f4807e-b5ff-4866-824e-6bba1a84fe96/words



 Request:

 {

 }

 Input:



 Output:

 If success  --

 {

   "words": [

          {"word": "aword", "translation":"pronunciation|sounds-like"},

          {"word": "anotherword", "translation":"pronunciation|sounds-like"},

          ...

    ]

 }

 If failed --

 {

              "code":401,

              "error":"Invalid customization_id (XXX) for user.",

              "code_description":Unauthorized"

 }



 Http Status Code:



 HTTP Code


 Notes

 200


 Success

 400


 Invalid value for 'customization_id'.

 401


 Invalid customization_id  (xxx) for user.

 500


 Service internal error



 Testing case:

 http://9.186.107.61:9080/text-to-speech/test/tts/GetWords.html



 Delete Word

 Deletes a single word belonging to customization_id

 API:

 DELETE /text-to-speech/api/v1/customizations/{customization_id}/words/{word}

 example: http://9.186.107.61:9080/text-to-speech/api/v1/customizations/74f4807e-b5ff-4866-824e-6bba1a84fe96/words/aword

                https://stream-d.watsonplatform.net/text-to-speech/api/v1/customizations/74f4807e-b5ff-4866-824e-6bba1a84fe96/words/aword



 Request:

 {

 }

 Input:

 word -- string,containing word to delete



 Output:



 If success  --

 Empty body



 If failed --

 {

              "code":401,

              "error":"Invalid customization_id (XXX) for user.",

              "code_description":Unauthorized"

 }



 Http Status Code:

 HTTP Code


 Notes

 204


 No Content  (means success but no content being returned)

 400


 Invalid value for 'customization_id'.
 400 	Word: xxx not found in customization_id: xxx-xxx

 401


 Invalid customization_id  (xxx) for user.

 500


 Service internal error



 Testing case:

 http://9.186.107.61:9080/text-to-speech/test/tts/DeleteWord.html



 Get Pronunciation

 Get the pronunciation for a word.  By default, the pronunciation is returned in IPA phone set.

 API:

 GET /text-to-speech/api/v1/pronunciation?voice=xx-XX_VoiceModel&text="aword"&format="ipa|ibm"

 example: http://9.186.107.61:9080/speechct/text-to-speech/api/v1/pronunciation?voice=en-US_LisaVoice&text=aword

                https://stream-d.watsonplatform.net/text-to-speech/api/v1/pronunciation?voice=en-US_LisaVoice&text=aword

 Request:

 {

 }

 Input:

 text -- string, contains word for which pronunciation is requested

 voice -- string, null or not null. If it is null, assumes the request is for the default voice; if it's not null, returns pronunciation using the phoneme set specified in the 'format' parameter for the given 'voice'

 format -- specifies which phoneme set to use to return the pronunciation, either "ipa" or "spr" (default is "ipa")



 Output:



 If success  --

 {

               "pronunciation":"pronunciation"

 }

 If failed --

 {

               "code":404

               "error":"Model <XXX> not found"

               "code_description":"Not Found"

 }



 Cassandra database structure



 Model Name: ttsmodel
 Column Name 	Data Type 	Key Type 	Comments
 userid 	varchar 	PARTITION KEY 	string comes from Bluemix
 dictid 	uuid 	PRIMARY KEY, INDEX 	an unique UUID string
 createtime 	timestamp 	PRIMARY KEY 	sort by desc
 dictname 	varchar 	  	created by user
 lang 	int 	  	language id
 description 	text
 dictionary 	list<text> 	  	the content words of dictionary
 lastmodified 	timestamp 	  	used for If-Modified-Since



 CQL:

 CREATE KEYSPACE speechct WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 2 };

 use speechct;

 CREATE TABLE ttsmodel (userid varchar, dictid uuid, createtime timestamp, dictname varchar, lang int, description text, dictionary list<text>, lastmodified timestamp, PRIMARY KEY (userid,createtime,dictid)) WITH CLUSTERING ORDER BY (createtime DESC);

 create index dictid_index on ttsmodel(dictid);

 create index lang_index on ttsmodel(lang);



  */


module.exports = TextToSpeechV1;
