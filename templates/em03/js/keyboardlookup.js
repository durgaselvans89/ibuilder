



	var  keyboardLookUp = function() {
		
		
		function getKeycodeForKeyIDName(p_keyname){
		// fall thru for keycodes, mycodes
		// http://stackoverflow.com/questions/13207927/switch-statement-multiple-cases-in-javascript
		// http://webdesign.about.com/od/localization/l/blhtmlcodes-math.htm
			switch(p_keyname)
			{
				
			case "colon":
			return "58";
			
			case "apostrophe":
			return "39";
			
			case "hyphen":
			return "45";
			
			case "question_mark":
			return "63";
			
			
			
			case "fraction":
			case "FRACTION":
			   //return "59";
			   return "&#92" + "(" + "&#92" + "frac{2013}{415}" + "&#92" + ")";
			
			case "zero":
			case "ZERO":
				return "48";
			
			case "one":	
			case "ONE":
				return "49";
			
			case"two":
			case "TWO":
              	return "50";

            case "three":
            case "THREE":
			  	return "51";
			
			case "four":
			case "FOUR":
			 	return "52";
			
			case "five":
			case "FIVE":
				 return "53";
			
			case "six":	
			case "SIX":
				return "54";
				
			case "seven":
			case "SEVEN":
	            return "55";
	
			case "eight":
	        case "EIGHT":
				return "56";

            case "nine":
			case "NINE":
				return "57";
			
			case "plus":
		    case "PLUS":
				return "43";
			
			case "minus":	
			case "MINUS":
				return "8722";
			
			case "equal":
			case "EQUAL":
				return "61";

            case 36:
            case "dollar":
			case "DOLLAR":
			    return "36";
			
			case "cent":
			case "CENT":
			    //&#162
			    return "162";
			
			case "fahrenheit":
			case "FAHRENHEIT":
			    return "8457";
			
			case "celsius":
			case "CELSIUS":
				return "8451";
			
			case "greater_than":
			case "GREATERTHAN":
			    return "62";
			
			case "less_than":
			case "LESSTHAN":
				return "60";
			
			case "comma":
			case "COMMA":
				return "44";
			
			case "period":
			case "PERIOD":
				return "46";
			
			case "space":
			case "SPACE":
				return "160"; //or 32 or "49";
			
			default:
			  	console.log("key not found in keyboardLookUp");
			  	return "NOTFOUND"
			}
			
		}
		
		
		/* LOWER CASE */
		function getLowerCaseKeycodeForKeyIDName(p_keyname){
			switch(p_keyname){
				
				case "letter_a":
				return "97";
				
				
				case "letter_b":
				return "98";
				
				case "letter_c":
				return "99";
				
				case "letter_d":
				return "100";
				
				
				case "letter_e":
				return "101";
				
				
				case "letter_f":
				return "102";
				
				
				case "letter_g":
				return "103";
				
				
				case "letter_h":
				return "104";
				
				case "letter_i":
				return "105";
				
				
				case "letter_j":
				return "106";
				
				
				case "letter_k":
				return "107";	
				
				case "letter_l":
				return "108";
				
				
				case "letter_m":
				return "109";
				
				
				case "letter_n":
				return "110";	
				
				case "letter_o":
				return "111";
				
				
				case "letter_p":
				return "112";
				
				
				case "letter_q":
				return "113";
				
				case "letter_r":
				return "114";
				
				
				case "letter_s":
				return "115";
				
				
				case "letter_t":
				return "116";
				
				case "letter_u":
				return "117";
				
				case "letter_v":
				return "118";
				
				
				case "letter_w":
				return "119";
				
				
				case "letter_x":
				return "120";
				
				case "letter_y":
				return "121";


				case "letter_z":
				return "122";
				
			
			default:
			  	console.log("key not found in keyboardLookUp");
			  	return "NOTFOUND"
			}

		}
		
		
		/* UPPER CASE */
		function getUpperCaseKeycodeForKeyIDName(p_keyname){
			
			switch(p_keyname){
				
				case "letter_a":
				return "65";
				
				
				case "letter_b":
				return "66";
				
				case "letter_c":
				return "67";
				
				case "letter_d":
				return "68";
				
				
				case "letter_e":
				return "69";
				
				
				case "letter_f":
				return "70";
				
				
				case "letter_g":
				return "71";
				
				
				case "letter_h":
				return "72";
				
				case "letter_i":
				return "73";
				
				
				case "letter_j":
				return "74";
				
				
				case "letter_k":
				return "75";	
				
				case "letter_l":
				return "76";
				
				
				case "letter_m":
				return "77";
				
				
				case "letter_n":
				return "78";	
				
				case "letter_o":
				return "79";
				
				
				case "letter_p":
				return "80";
				
				
				case "letter_q":
				return "81";
				
				case "letter_r":
				return "82";
				
				
				case "letter_s":
				return "83";
				
				
				case "letter_t":
				return "84";
				
				case "letter_u":
				return "85";
				
				case "letter_v":
				return "86";
				
				
				case "letter_w":
				return "87";
				
				
				case "letter_x":
				return "88";
				
				case "letter_y":
				return "89";


				case "letter_z":
				return "90";
				
			
			
			default:
			  	console.log("key not found in keyboardLookUp");
			  	return "NOTFOUND"
			}

		}
		
		

		return {
    	getKeycodeForKeyIDName:getKeycodeForKeyIDName,
        getLowerCaseKeycodeForKeyIDName:getLowerCaseKeycodeForKeyIDName,
		getUpperCaseKeycodeForKeyIDName:getUpperCaseKeycodeForKeyIDName
	
		};
	}
