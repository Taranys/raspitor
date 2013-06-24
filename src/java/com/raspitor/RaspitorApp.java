package com.raspitor;

import org.vertx.java.core.Handler;
import org.vertx.java.core.http.HttpServer;
import org.vertx.java.core.http.HttpServerRequest;
import org.vertx.java.core.http.RouteMatcher;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.sockjs.SockJSServer;
import org.vertx.java.platform.Verticle;

public class RaspitorApp extends Verticle {
    @Override
    public void start() {
        super.start();

        RouteMatcher routeMatcher = new RouteMatcher();
        routeMatcher.get("/", new Handler<HttpServerRequest>() {
            @Override
            public void handle(HttpServerRequest event) {
                event.response().sendFile("web/index.html");
            }
        });

        routeMatcher.noMatch(new Handler<HttpServerRequest>() {
            @Override
            public void handle(HttpServerRequest event) {
                event.response().sendFile("web/" + event.path());
            }
        });

        HttpServer httpServer = vertx.createHttpServer();
        httpServer.requestHandler(routeMatcher);

        getContainer().logger().info("Server created");

        SockJSServer sockJSServer = vertx.createSockJSServer(httpServer);
        sockJSServer.bridge(new JsonObject().putString("prefix", "/eventbus"),
                new JsonArray(),
                new JsonArray().add(new JsonObject().putString("address", "web.client")),
                5 * 60 * 1000);

        getContainer().logger().info("SockJS bridge created");

        httpServer.listen(1235);

        getContainer().logger().info("Server listening");

        container.deployVerticle(StatSender.class.getName());
    }
}
