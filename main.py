import getpass
import oracledb
import tornado.ioloop
import tornado.web
import hashlib
import time


oracledb.init_oracle_client(lib_dir=r"C:\oraclexe\app\oracle\product\11.2.0\server\bin")

connection = oracledb.connect(
    user="project",
    password="project",
    dsn='localhost/xe')
print("Successfully connected to Oracle Database")

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        if not self.get_secure_cookie("session_details") or self.get_secure_cookie("session_details").decode("utf-8") == '0:abcd':
            self.redirect('/signin')
        else:
            self.redirect('/home')

class SigninHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('signin.html')

class SignincheckHandler(tornado.web.RequestHandler):
    def post(self):
        login = 0
        email = self.get_argument('email')
        password = self.get_argument('password')

        with connection.cursor() as cursor:
            sql_stmt1 = "select CUSTOMER_ID, C_NAME from CUSTOMERS where EMAIL = '" + str(email) + "' and C_PASSWORD = '" + str(hashlib.md5(password.encode('utf-8')).hexdigest()) +  "'"
            #print(sql_stmt)
            for row in cursor.execute(sql_stmt1):
                if (row[0]):
                    cid = row[0]
                    cname = row[1]
                    login = 1
                else:
                    login = 0

        if(login == 1):
            self.set_secure_cookie("session_details", str(cid) + ':' + str(cname))
            #self.write("Login Successful")
            self.redirect('/home')
        else:
            self.set_secure_cookie("session_details", "0:abcd")
            #self.write("Login Failed")
            self.redirect('/signin')

class SignupHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('signup.html')

class SignupcheckHandler(tornado.web.RequestHandler):
    def post(self):
        login = 0
        name = self.get_argument('name')
        phone = self.get_argument('phone')
        email = self.get_argument('email')
        password = self.get_argument('password')

        customer_id = int(time.time())
        try:
            with connection.cursor() as cursor:
                sql_stmt2 = "INSERT INTO customers VALUES ("+str(customer_id) + ",'" + str(name) + "','" + str(hashlib.md5(password.encode('utf-8')).hexdigest()) +  "',+ '" + str(email) + "','" + str(phone) + "')"
                 #print(sql_stmt)
                cursor.execute(sql_stmt2)
            connection.commit()

            self.redirect('/signin')

        except Exception as e:
                print(str(e))
                self.write("failed")

class BookingHandler(tornado.web.RequestHandler):
    def post(self):
        movie = self.get_argument('movie')
        seats = self.get_argument('seats')
        theater = self.get_argument('showtime')
        payment = self.get_argument('payment')
        #print(movie)
        #print(seats)
        #print(theater)
        #print(payment)
        cid = self.get_secure_cookie("session_details").decode("utf-8").split(':')[0]

        curr_id = int(time.time())

        try:
            with connection.cursor() as cursor:
                sql_stmt = "insert into seats values (" + str(curr_id) + ",'" + str(seats) + "'," + str(str(seats).count(',') + 1) + ")"
                #print(sql_stmt)
                cursor.execute(sql_stmt)

                sql_stmt = "insert into tickets values (" + str(curr_id) + "," + str(int(theater) + 1) + ",1," + str(curr_id) + "," + str(payment) + ")"
                #print(sql_stmt)
                cursor.execute(sql_stmt)

                sql_stmt = "insert into booking values (" + str(curr_id) + "," + str(cid) + "," + str(curr_id) + ",'" + str(movie) + "')"
                #print(sql_stmt)
                cursor.execute(sql_stmt)

            connection.commit()

            self.write("success")
        except Exception as e:
            print(str(e))
            self.write("failed")

class GetBookingHandler(tornado.web.RequestHandler):
    def get(self):
        
        cid = self.get_secure_cookie("session_details").decode("utf-8").split(':')[0]

        bookingHTML = "<table >"

        with connection.cursor() as cursor:
            for row in cursor.execute('select b.booked_at1, p.payment_mode, s.seat_no, t1.location, t1.screen, t1.t_name  from booking b INNER JOIN tickets t ON b.ticket_id = t.ticket_id INNER JOIN seats s ON t.seat_id=s.seat_id INNER JOIN payment p ON t.payment_id=p.payment_id INNER JOIN theater t1 ON t.theater_id=t1.theater_id where b.customer_id=' + str(cid)):
                if (row[0]):
                    movie = row[0]
                    payment = row[1]
                    seats = row[2]
                    location = row[3]
                    screen = row[4]
                    name = row[5]
                    
                    bookingHTML += "<tr><td style='border: 1px solid white;border-radius: 10px;'>Movie Name: " + str(movie) + "<br>Theater Name: " + str(name) + "<br>Location: " + str(location) + "<br>Screen: " + str(screen) + "<br>Seats: " + str(seats) + "<br>Payment Method: " + str(payment) + "<br></td></tr>"

        bookingHTML += "</table>"

        self.write(bookingHTML)

class LogoutHandler(tornado.web.RequestHandler):
    def get(self):
        self.set_secure_cookie("session_details", "0:abcd")
        self.redirect('/')

class HomeHandler(tornado.web.RequestHandler):
    def get(self):
        if not self.get_secure_cookie("session_details") or self.get_secure_cookie("session_details").decode("utf-8") == '0:abcd':
            self.redirect('/signin')
        else:
            cookie = self.get_secure_cookie("session_details").decode("utf-8")
            #print(cookie)
            cid = cookie.split(':')[0]
            cname = cookie.split(':')[1]
            self.render('home.html', c_name=cname, c_id=cid,)
        

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/signin", SigninHandler),
        (r"/signincheck", SignincheckHandler),
        (r"/signup", SignupHandler),
        (r"/signupcheck", SignupcheckHandler),
        (r"/home", HomeHandler),
        (r"/logout", LogoutHandler),
        (r"/postbooking", BookingHandler),
        (r"/getbooking", GetBookingHandler),
        (r"/static/(.*)",tornado.web.StaticFileHandler, {"path": "./static"},),
    ], cookie_secret="qwertyuiopasdfghjklzxcvbnm")

if __name__ == "__main__":
    port = 8888
    app = make_app()
    app.listen(port)
    print("Web server running at localhost:" + str(port))
    tornado.ioloop.IOLoop.current().start()
    
