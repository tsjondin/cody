
FROM node:argon
MAINTAINER tsjondin <tsjondin@op5.com>

RUN mkdir -p /tmp/cody
WORKDIR /tmp/cody
COPY . /tmp/cody

CMD ["npm", "install"]
CMD ["npm", "run-script", "build"]
CMD ["npm", "test"]
