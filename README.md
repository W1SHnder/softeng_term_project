# INSTRUCTIONS
____________________________________________________________________________________

### Frontend: ./web_ui
- `npm install`: builds frontend environment
- `npm start`: runs webpack dev server

### Backend: ./API
To build the environment:
- `conda env create -f term-project-11B.yaml`
- Otherwise, to manually install dependencies, you will need
```
- django
- djangorestframework
- django-cors-headers
- mysqlclient
```
#### To manage ORM migrations:
-`python3 manage.py makemigrations endpoints` [to create migrations]
-`python3 manage.py migrate`[to apply migrations]

#### To start the dev server:
- `python3 manage.py runserver`

    
#### Configuration: All configuration for the backend are in ./API/Unchained/Unchained/settings.py
- To configure database details, refer to the `DATABASES` field in settings.py
- To configure the email backend and details, refer to fields labled `EMAIL_*` in settings.py
- CORS settings are currently configured to "allow all." THIS SETTING IS NOT SECURE!!! CHANGE BEFORE DEPLOYING TO PRODUCTION
- To create a more explicit CORS configuration, refer to the [django-cors-headers](https://pypi.org/project/django-cors-headers/) documentation
