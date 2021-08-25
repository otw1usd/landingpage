$(function(){
    var current = location.pathname;
    $('.nav-link').each(function(){
        var $this = $(this);
        if($this.attr('href').indexOf(current) !== -1){
            $this.addClass('active');
        }
    })
})
