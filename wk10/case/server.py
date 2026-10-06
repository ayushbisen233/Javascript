import http.server
import socketserver
import json
import os

PORT = 8000
JSON_FILE = 'employees.json'

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/update-json':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                # Parse the incoming JSON data (expecting a new employee object)
                new_employee = json.loads(post_data.decode('utf-8'))
                
                # Read existing data
                if os.path.exists(JSON_FILE):
                    with open(JSON_FILE, 'r') as f:
                        data = json.load(f)
                else:
                    data = []
                
                # Check for duplicate ID
                if any(emp.get('empId') == new_employee.get('empId') for emp in data):
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': 'Employee ID already exists'}).encode())
                    return

                # Append new employee
                data.append(new_employee)
                
                # Write back to file
                with open(JSON_FILE, 'w') as f:
                    json.dump(data, f, indent=4)
                    
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True, 'message': 'Successfully updated employees.json'}).encode())
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
        else:
            self.send_error(404, "Endpoint not found")

if __name__ == "__main__":
    Handler = CustomHandler
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        print("Please open http://localhost:8000/ticket_booking.html in your browser.")
        httpd.serve_forever()
