from django import forms
from django.contrib import admin
from django.contrib.auth.models import User
from .models import Profile

class ProfileForm(forms.ModelForm):
	class Meta:
		model = Profile
		fields = ['user', 'fullname', 'phoneNumber']

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)

class ProfileAdmin(admin.ModelAdmin):
	list_display = ("user", "fullname", "phoneNumber")
	readonly_fields = ("user",)
	ordering = ("user",)
	form = ProfileForm

	def formfield_for_foreignkey(self, db_field, request, **kwargs):
		if db_field.name == "user":
			kwargs["queryset"] = User.objects.filter(profile__isnull=True)
		return super().formfield_for_foreignkey(db_field, request, **kwargs)

admin.site.register(Profile, ProfileAdmin)
