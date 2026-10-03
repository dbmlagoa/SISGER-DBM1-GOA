import http.server
import os
import re
import socket
import sys

class RangeRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/api/check-checklist'):
            try:
                import urllib.request, json
                url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTu4q9jr-xN_divraeeFmyyDeoANph3559wXe3sXl54Oek2LvNt9zVhttk5Uivh_rKGlhfrgUTtCTOW/pub?output=csv'
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=5) as resp:
                    data = resp.read().decode('utf-8', errors='ignore')
                    lines = [l.strip() for l in data.split('\n') if l.strip()]
                    cols = lines[1].split(',') if len(lines) > 1 else []
                    val = cols[1].strip() if len(cols) > 1 else ''
                    is_ok = (val == '1')
                    res = json.dumps({
                        'status': 'success',
                        'conferido': is_ok,
                        'valor': val,
                        'msg': 'Conferido' if is_ok else 'Pendente',
                        'raw': lines[0] if lines else ''
                    }).encode('utf-8')
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
                    self.send_header('Content-Length', str(len(res)))
                    self.end_headers()
                    self.wfile.write(res)
                    return
            except Exception as e:
                import json
                err_res = json.dumps({'status': 'error', 'message': str(e)}).encode('utf-8')
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-Length', str(len(err_res)))
                self.end_headers()
                self.wfile.write(err_res)
                return
        super().do_GET()

    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

    def send_head(self):
        if 'Range' not in self.headers:
            self.range = None
            return super().send_head()
        
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()
        
        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(http.HTTPStatus.NOT_FOUND, "File not found")
            return None
        
        fs = os.fstat(f.fileno())
        total_size = fs[6]
        
        range_header = self.headers.get('Range', '').strip()
        match = re.match(r'bytes=(\d+)-(\d*)', range_header)
        if not match:
            self.range = None
            return super().send_head()
        
        first = int(match.group(1))
        last = int(match.group(2)) if match.group(2) else total_size - 1
        if first >= total_size or last >= total_size or first > last:
            self.send_error(http.HTTPStatus.RANGE_NOT_SATISFIABLE, "Requested Range Not Satisfiable")
            self.send_header("Content-Range", f"bytes */{total_size}")
            self.end_headers()
            f.close()
            return None
        
        self.range = (first, last)
        length = last - first + 1
        self.send_response(http.HTTPStatus.PARTIAL_CONTENT)
        self.send_header("Content-type", self.guess_type(path))
        self.send_header("Content-Range", f"bytes {first}-{last}/{total_size}")
        self.send_header("Content-Length", str(length))
        self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        
        f.seek(first)
        return f

    def copyfile(self, source, outputfile):
        if not hasattr(self, 'range') or not self.range:
            try:
                super().copyfile(source, outputfile)
            except (ConnectionResetError, BrokenPipeError, ConnectionAbortedError, OSError):
                pass
            return
        
        first, last = self.range
        length = last - first + 1
        source.seek(first)
        
        buffer_size = 64 * 1024
        bytes_sent = 0
        while bytes_sent < length:
            to_read = min(buffer_size, length - bytes_sent)
            buf = source.read(to_read)
            if not buf:
                break
            try:
                outputfile.write(buf)
            except (ConnectionResetError, BrokenPipeError, ConnectionAbortedError, OSError):
                break
            bytes_sent += len(buf)

class DualStackServer(http.server.ThreadingHTTPServer):
    address_family = socket.AF_INET6
    daemon_threads = True

    def server_bind(self):
        try:
            self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        except Exception as e:
            pass
        super().server_bind()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    server = DualStackServer(('::', port), RangeRequestHandler)
    print(f"Server started on port {port}", flush=True)
    server.serve_forever()
