#!/usr/bin/python
# -*- encoding: utf-8 -*-

from flask import Flask, session, render_template, json, request
#from flask.ext.mysql import MySQLdb as mdb
from werkzeug import generate_password_hash, check_password_hash
from contextlib import closing
from json import loads
import os, sys
#import pymysql as mdb
import mysql.connector as mdb

#MySQL configurations

reload(sys)  # Reload does the trick!
sys.setdefaultencoding('utf-8')

 
app = Flask(__name__)      
#mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'kabina'
app.config['MYSQL_DATABASE_PASSWORD'] = 'ah64jj3!'
app.config['MYSQL_DATABASE_DB'] = 'CTOUR'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
#mysql.init_app(app)



@app.route('/')
def home():
  return render_template('index.html')

@app.route('/gettourinfo', methods=['POST','GET'])
def gettourinfo():
	global conn
	try:
		#conn = mdb.connect('localhost', 'kabina', 'ah64jj3!', 'CTOUR')
		print "It's Test"
		conn = mdb.connect(user='kabina', password='ah64jj3!', host='127.0.0.1', database='CTOUR')
		#conn = mdb.connect(user='root', passwd='ah64jj3!', port=3306, host='127.0.0.1', db='CTOUR')

		# read the posted values from the UI
		uid = session.get("id")
		data = {}
		ctour_seq = request.json['ctour_seq']
		print "______"+ctour_seq

		query = ("select ctour_seq, ctour_title, ctour_days, ctour_start_place, ctour_end_place, open_yn, ctour_desc from ctour_master where ctour_seq = %s")
		querywpt = ("select ctour_seq, wpt_seq, wpt_name, nights, addr, note, cost, distance from ctour_wpt where ctour_seq = %s")
		queryplace = ("select ctour_seq, wpt_seq, place_seq, place_id, place_name, place_addr, place_note, place_cost, place_routeyn, place_routeinfo from ctour_wptplace where ctour_seq = %s")


		
		#with closing(mysql.connect()) as conn:
		cursor = conn.cursor()
			#with closing(conn.cursor()) as cursor:
		cursor.execute(query, [ctour_seq])
		ctour_master = cursor.fetchall()
		if len(ctour_master) == 0:
			ctour_master = [[-1,'','','','','','','']]

		cursor.execute(querywpt, [str(ctour_seq)])
		ctour_wpt = cursor.fetchall()

		cursor.execute(queryplace, [str(ctour_seq)])
		ctour_place = cursor.fetchall()

		data.update({'ctour_master':ctour_master, 'ctour_wpt':ctour_wpt, 'ctour_place':ctour_place})
		print "+===================================="
		print ctour_master, ctour_wpt, ctour_place
	
		if data :
				return json.dumps({'message':'tour info retrieved successfully !', 'ctour':data})
		else:
				return json.dumps({'error':str(data[0])})

	except Exception as e:
		return json.dumps({'error':str(e)})
	#finally:
		##if conn:
		#conn.close()
	


@app.route('/login', methods=['POST','GET'])
def tour():
	try:
		#conn = mdb.connect('localhost', 'kabina', 'ah64jj3!', 'CTOUR')
		conn = mdb.connect(user='kabina', password='ah64jj3!', host='127.0.0.1', database='CTOUR')
		#conn = mdb.connect(user='kabina', passwd='ah64jj3!', port=3306, host='127.0.0.1', db='CTOUR')

		session['id'] = request.args.get('email')
		session['name'] = request.args.get('name')
		session['pic'] = request.args.get('pic')

		uid = session.get("id")
		query = ("select ctour_seq, ctour_title from ctour_master where user_id = %s")

		
		#with closing(mysql.connect()) as conn:
		cursor = conn.cursor()
			#with closing(conn.cursor()) as cursor:
		cursor.execute(query, [uid])
		ctour_list = cursor.fetchall()

		print ctour_list
	
		#if ctour_list :
				#return json.dumps({'message':'tour info retrieved successfully !', 'ctour_list':ctour_list})
		#else:
				#return json.dumps({'error':str(ctour_list[0])})

	except Exception as e:
		return json.dumps({'error':str(e)})
	#finally:
	#if conn:
	#	conn.close()
	
	return render_template('map.html', ctour_list=ctour_list)

@app.route('/about')
def about():
  return render_template('about.html')

@app.route('/showSignUp')
def showSignUp():
    return render_template('signup.html')

@app.route('/savemaster',methods=['POST', 'GET'])
def signUp():
	try:
		#conn = mdb.connect('localhost', 'kabina', 'ah64jj3!', 'CTOUR')
		#conn = mdb.connect(user='kabina', passwd='ah64jj3!', port=3306, host='127.0.0.1', db='CTOUR' )
		conn = mdb.connect(user='kabina', password='ah64jj3!', host='127.0.0.1', database='CTOUR')
 
		# read the posted values from the UI
		tourdata = request.json['tourdata']
		ctour_title = tourdata["ctour_title"]
		ctour_seq = tourdata["ctour_seq"]
		ctour_title = tourdata["ctour_title"]
		ctour_days = tourdata["ctour_days"]
		open_yn = tourdata["open_yn"]
		ctour_desc = tourdata["ctour_desc"]
		ctour_end_place = tourdata["address_end"]
		ctour_start_place = tourdata["address_start"]
		waypoints = tourdata["waypoints"]
		places = tourdata["places"]
		user_id = session.get("id")
		print "======================================"
		print ctour_desc
		print "======================================"
		print len(ctour_seq)

		itour_seq = -1

		if len(ctour_seq) == 0:
			itour_seq = -1
		else:
			itour_seq = int(ctour_seq)
			print "itour_seq"+ctour_seq
		
		new_seq = -1

		if ctour_title :

			#with closing(mysql.connect()) as conn:
				#with closing(conn.cursor()) as cursor:
			cursor = conn.cursor()
			result = cursor.callproc('sp_isTour', (itour_seq, ctour_title, ctour_days, ctour_start_place, ctour_end_place, user_id, open_yn, ctour_desc, new_seq))
			print "result"
			print result
	
			print "new_seq"+str(result[8])
			new_seq = str(result[8])
	
			for wpt in waypoints :
                                print "========================"
				wpt_index = wpt["index"]
				wpt_name = wpt["wptnm"]
				nights = wpt["nights"]
				addr = wpt["addr"]
				note = wpt["note"]
				cost = wpt["cost"]
				distance = wpt["distance"]
                                print "========================"
                                print wpt_index
                                print wpt["wptnm"]
                                print nights
                                print addr
				print note
				print cost
				print distance
				wpt_index = wpt["index"]
				cursor.callproc('sp_isTourWpt', (new_seq, wpt_index, wpt_name, nights, addr, note, cost, distance))
                                print "========================"
			for place in places :
				index = place["index"]
				place_seq = place["place_seq"]
				place_id = place["place_id"]
				place_name = place["place_name"]
				place_addr = place["place_addr"]
				place_note = place["place_note"]
				place_cost = place["place_cost"]
				place_routeyn = place["place_routeyn"]
				place_routeinfo = place["place_routeinfo"]
				print index, place_name, place_id
				cursor.callproc('sp_isTourWptPlace', (new_seq, index, place_seq, place_id, place_name, place_addr, place_note, place_cost, place_routeyn, place_routeinfo))
				
	
			#ctour_wpt = cursor.fetchall()
			
			conn.commit()
							#return json.dumps({'message':'tour master created successfully !', 'ctour_seq':str(data[0])})
			return json.dumps({'message':'tour master created successfully !', 'ctour_master':result})
				#return json.dumps({'error':str(data[0])})
		else:
			return json.dumps({'html':'<span>Enter the required fields</span>'})
	except Exception as e:
		if conn:
			conn.rollback()
			print str(e)
			return json.dumps({'error':str(e)})
	finally:
		if conn:
			conn.close()

if __name__ == '__main__':
	app.config['SESSION_TYPE'] = 'memcached'
	app.config['SECRET_KEY'] = 'super secret key'
	app.debug=True
	app.run(host='192.168.0.144', port=5000)
