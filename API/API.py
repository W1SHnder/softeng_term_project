from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)

# Configuration for MariaDB connection
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'password',
    'database': 'MovieDB'
}

# Function to connect to MariaDB and execute queries
def execute_query(query, params=()):
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute(query, params)
    result = cursor.fetchall()
    conn.close()
    return result

# API endpoint to fetch movies by title
#URL: https://<domain>/movies?title=<title>
@app.route('/movies')
def get_movies_by_title():
    title = request.args.get('title')
    if title:
        query = "SELECT * FROM Movie WHERE title LIKE %s"
        movies = execute_query(query, (f'%{title}%',))
        return jsonify(movies)
    else:
        query = "SELECT * FROM Movie"
        movies = execute_query(query)
        return jsonify(movies)



if __name__ == '__main__':
    app.run(debug=True)

