
this.vtip = function(selector) {
    this.xOffset = -10; // x distance from mouse
    this.yOffset = 20; // y distance from mouse
    this.winWidth = $(window).width();  
    
    $("html").click(function(){
        $('p#vtip').remove();
    });
    
    var mouseoverFun = function(e){
        var $this = this;
        setTimeout(function(){
            if($this.title==''){
                return;
            }
            $this.t = $this.title||'';
            $this.title = '';
            $this.top = (e.pageY + yOffset); 
            var cLeft =$this.left = (e.pageX + xOffset);     
            $('body').append( '<p id="vtip"><img id="vtipArrow" />' + $this.t + '</p>' );
            
            if(winWidth-cLeft<200){
                var leftPx = 200-(winWidth-cLeft);
                $('p#vtip #vtipArrow').attr("src", 'http://www.wsd.com/css/images/vtip_arrow.png').css("left",leftPx+"px");
                $('p#vtip').css({"top":$this.top+"px","left":$this.left+"px","width":"200px"}).fadeIn("slow");
                if($this.t.length < 30){
                    $('p#vtip #vtipArrow').css("left","");
                    $('p#vtip').css("width", "auto");
                }
            }else{          
                $('p#vtip #vtipArrow').attr("src", 'http://www.wsd.com/css/images/vtip_arrow.png');
                $('p#vtip').css({"top":$this.top+"px","left":$this.left+"px"}).fadeIn("slow");
            }
        }, 0);
        
    };
    
    var mouseoutFun = function(){
        var $this = this;
        setTimeout(function(){
            if($this.t===undefined){
                return;
            }
            $this.title = $this.t;
            $("p#vtip").fadeOut("slow").remove();
        }, 0);
    };
    
    var mousemoveFun = function(e) {
        if(this.t===undefined){
            return;
        }
        this.top = (e.pageY + yOffset);
        var cLeft = this.left = (e.pageX + xOffset);   
        if(winWidth-cLeft<200){
            if(this.t.length >= 30){
                cLeft = winWidth-200;
            }
        }      
        $("p#vtip").css("top", this.top+"px").css("left", cLeft+"px");
    };
    
    var target = selector?$(selector):$(".vtip");
    
    target.unbind('mouseover', mouseoverFun).unbind('mouseout', mouseoutFun).unbind('mousemove', mousemoveFun)
    .mouseover(mouseoverFun).mouseout(mouseoutFun).mousemove(mousemoveFun);
};

jQuery(document).ready(function($){vtip();});