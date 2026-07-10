import multiprocessing

# Gunicorn configuration file
# Ref: https://docs.gunicorn.org/en/stable/configure.html

# Socket binding
bind = "0.0.0.0:8000"

# Worker processes
# For CPU-bound/IO-bound tasks on ECS Fargate (0.5 vCPU), 2 workers is optimal
workers = 2
worker_class = "sync"

# Timeout
timeout = 120

# Logging
accesslog = "-"  # Log to stdout
errorlog = "-"   # Log to stderr
loglevel = "info"

# Keepalive connection duration
keepalive = 5
