$(document).ready(()=>{

    $("#checkCapitalCity").on("click", ()=>{
        
        var cartgory = "Capital City"
        var value = $("#countryCC").val();
        $("#results").html("");
        $("#type").text(cartgory);

        $.ajax({
            url:"php/getdata.php"
            ,type:"GET"
            ,dataType:"json"
            ,data:{
                country: value
                ,type: 'capital'
            }
            ,success: function(result){

                $("#type").text(cartgory);
                $("#results").html("<div>"+result['geonames'][0].countryName+"</div><div>"+result['geonames'][0].capital+"</div>"); 

            }
            ,error: function(err , status, errorType){
                
                alert("error: " + errorType);
            }
        })

    });


    $("#checkNeighboringCountries").on("click", ()=>{
        
        var cartgory = "Neighboring Countries"
        var value = $("#countryNC").val(); 

        $("#results").html("");
        $("#type").text(cartgory);



        $.ajax({
            url:"php/getdata.php"
            ,type:"GET"
            ,dataType:"json"
            ,data:{
                country: value
                ,type: 'borders'
            }
            ,success: function(result){
                

                var li = "";
                const CountriesArray = result.geonames;
                CountriesArray.forEach(element => {
                    li += `<li>${element.toponymName}</li>`; 

                });
                if(result.status === "error"){
                    $("#results").html("<h3>an error occured</h3>");
                }



               
                $("#results").html("<div>"+value+"</div><div><ol>"+li+"</ol></div>"); 

            }
            ,error: function(err , status, errorType){
                
                alert("error: " + errorType);
            }
        })

    });


    $("#checkTimeZone").on("click", ()=>{
        
        var cartgory = "Time Zone"
        var lt = $("#lt").val();
        var ln = $("#ln").val()

        $("#results").html("");
        $("#type").text(cartgory);

        $.ajax({
            url:"php/getdata.php"
            ,type:"GET"
            ,dataType:"json"
            ,data:{
                ln: ln
                ,lt: lt
                ,type: 'timezone'
            }
            ,success: function(result){

                if(result.status === "error"){
                    $("#results").html("<h3>an error occured</h3>");
                }else{
                    $("#results").html(`
                    <div><h3>lattude: ${lt}</h3><h3>longtude: ${ln}</h3></div>
                    
                    <div>
                    time: ${result.time}
                    <hr/>
                    timezoneId: ${result.timezoneId}
                    <hr/>
                    countryName: ${result.countryName}
                    <hr/>
                    sunset: ${result.sunset}
                    <hr/>
                    sunrise: ${result.sunrise}
                    <hr/>
                    Gmt: ${result.gmtOffset}
                    
                    </div>

                    `);
                }
                

                $("#results").html("<div> <h1>lattude:</h1> "+lt+"<br/>lattude: "+lt+"</div><div><ol>"+li+"</ol></div>"); 

            }
            ,error: function(err , status, errorType){
                
                alert("error: " + errorType);
            }
        })

    });

});