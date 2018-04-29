FROM nginx:latest 

# Environment variables
ENV HOMEPATH /webapp

# Install modules
RUN apt-get update && apt-get install -y curl nano

WORKDIR $HOMEPATH
