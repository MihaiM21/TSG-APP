FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["StudentFormAPI.csproj", "./"]
RUN dotnet restore "StudentFormAPI.csproj"
COPY . .
RUN dotnet build "StudentFormAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "StudentFormAPI.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "StudentFormAPI.dll"]