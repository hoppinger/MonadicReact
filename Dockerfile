FROM microsoft/dotnet:1.1.0-sdk-projectjson
WORKDIR /app
ENV ASPNETCORE_URLS http://*:5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "MonadicComponents.dll"]
COPY . /app
