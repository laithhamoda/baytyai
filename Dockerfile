FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080
RUN mkdir -p /app/data

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["src/BaytyAI.Domain/BaytyAI.Domain.csproj", "src/BaytyAI.Domain/"]
COPY ["src/BaytyAI.Application/BaytyAI.Application.csproj", "src/BaytyAI.Application/"]
COPY ["src/BaytyAI.Infrastructure/BaytyAI.Infrastructure.csproj", "src/BaytyAI.Infrastructure/"]
COPY ["src/BaytyAI.API/BaytyAI.API.csproj", "src/BaytyAI.API/"]

RUN dotnet restore "src/BaytyAI.API/BaytyAI.API.csproj"

COPY . .

RUN dotnet publish "src/BaytyAI.API/BaytyAI.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
VOLUME ["/app/data"]
ENTRYPOINT ["dotnet", "BaytyAI.API.dll"]
