const QSection = document.getElementById("QSection");
const status = document.getElementById("status");
const navbuttons = document.getElementById("navbuttons");
const prevBut = document.getElementById("prev");
const nextBut = document.getElementById("next");
const email_address = document.getElementById("email_address");

var questions=[];
var Qno = 0;
var marks = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
var QuestionData=[];

function init(){
    prevBut.style.display="none";
    nextBut.style.display="none";
    fetch('/getQuestions').then(res=>res.json()).
    then(data=>{
        for(i=0;i<data.question.length;i++){
            QuestionData[i]=data.question[i].name;
        var newQ = '<div class="question ml-sm-5 pl-sm-5 pt-2"><div class="py-2 h5"><b>'+data.question[i].Q+'</b></div><div class="ml-md-3 ml-sm-3 pl-md-5 pt-sm-0 pt-3" id="options">';
        for(j=0;j<data.question[i].options.length;j++){
        newQ += ' <label class="options">'+data.question[i].options[j]+' <input type="radio" value="'+data.question[i].values[j]+'" name="'+data.question[i].name+'"> <span class="checkmark"></span> </label>';
        }
        newQ+='</div>';
        questions[i]=newQ;
        }
    });
}

function showQuestion(){
    nextBut.style.display="inline-block";
    if(Qno==0){
        prevBut.style.display="none";
    }else{
        prevBut.style.display="inline-block";
    }
    QSection.innerHTML=questions[Qno];
}

function previous(){
    if(Qno>0){
        Qno--;
        showQuestion();
    }
}
function next(){
    var ele = (document.getElementsByName(QuestionData[Qno]));
    var selected = false;
    var Qmark=0;
    for(i=0;i<ele.length;i++){
        if(ele[i].checked){
            selected=true;
            Qmark=ele[i].value;
        }
    }
    if(!selected){
        status.innerHTML="please select answer from the following option with best of your knowledge";
    }
    if(Qno<questions.length-1 && selected){
        marks[Qno]=parseInt(Qmark);
        Qno++;
        status.innerHTML="";
        showQuestion();
    }
    else if(Qno==questions.length-1){
        marks[Qno]=parseInt(Qmark);
        var totalMarks=0;
        for(i=0;i<marks.length;i++){
            totalMarks+=marks[i];
        }
        prevBut.style.display="none";
        nextBut.style.display="none";
        var url = '/getResult?result='+totalMarks+"&email="+email_address.value;
        fetch(url).then(res=>res.json()).
        then(data=>{
            QSection.style.textAlign="center";
            QSection.style.color=data.color;
            QSection.style.fontSize="30px";
            var showData = totalMarks+"/24";
            showData+="<br/><br/>PDF for yoga and Food Chart has been sent to your email<br/>"
            showData+="Click <a href='/"+data.color+"' target='_blank'>link</a> to see";
            QSection.innerHTML=showData;
        });
    }
}

function readEmail(){
    console.log(email_address.value);
    if((email_address.value=="" || email_address.value==null || email_address.value==undefined)){
        status.innerHTML="Email can't be empty";
    }else{
        status.innerHTML="";
        showQuestion();
    }
}