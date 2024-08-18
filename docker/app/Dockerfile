FROM ruby:3.3.4
ARG RUBYGEMS_VERSION=3.3.23

# install nodejs
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get update -qq && \
    apt-get install -y postgresql-client build-essential libpq-dev nodejs

WORKDIR /app

COPY Gemfile Gemfile.lock ./

RUN gem update --system ${RUBYGEMS_VERSION} && \
    gem install bundler && \
    bundle install

RUN rm -f config/master.key && rm -f config/credentials.yml.enc && rails credentials:edit


COPY docker/app/entry-point.sh /usr/bin/
RUN chmod +x /usr/bin/entry-point.sh
ENTRYPOINT [ "entry-point.sh" ]

# 非 root ユーザーの作成
RUN useradd -ms /bin/bash tokium

EXPOSE 3000
