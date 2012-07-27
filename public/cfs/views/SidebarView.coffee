#todo Change to use backbone js later
$('#nav_menu .accordion-group .accordion-heading').live 'click', () ->
	$('#nav_menu .accordion-group .accordion-heading').removeClass('active-head');
	$(this).addClass('active-head');
	return
	