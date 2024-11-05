using RuleChaos.Models;

var gameServer = new GameServer("http://localhost:8080/");
await gameServer.StartAsync();
