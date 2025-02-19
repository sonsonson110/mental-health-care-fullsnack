﻿Overall architecture of the application
```mermaid
graph TD
    A[Client Browser] -->|HTTP/HTTPS| B[Angular Frontend]
    B -->|API Calls| C[ASP.NET Core Web API]
    C --> K["API (Host)"]
    C --> D[Application Layer]
    C --> F[Infrastructure Layer]

    C --> E[Domain Layer]
    F -->|Data Access| G[(PostgreSQL Database)]
    F -->|AI Integration| H[Gemini API]
    F --> |Email Integration| I[Gmail]
    F --> |Caching Integration| J[Redis]
    
    
    subgraph "Frontend"
    B
    end
    
    subgraph "Backend"
    K
    C
    D
    E
    F
    end
    
    subgraph "External Services"
    G
    H
    I
    J
    end
```

Add migration
```bash
dotnet ef migrations add <name> --verbose -s .\API\ -p .\Infrastructure\
````

Apply migration (manually)
```bash
dotnet ef database update --verbose -s .\API\ -p .\Infrastructure\
```

## Connect to websocket through postman payload
```json
{"protocol":"json","version":1}
```

## Call server method through postman websocket
```json
{
  "target": "SendP2PMessage",
  "type": 1,
  "arguments": [
    {
      "sentToUserId": "e539848a-d654-47c2-8704-c584541ec310",
      "conversationId": "481956e8-6e10-4d15-b81b-b22a67391385",
      "content": "hello world"
    }
  ]
}
```
