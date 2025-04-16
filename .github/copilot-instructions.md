- @azure Rule - Use Azure Best Practices: When generating code for Azure, running terminal commands for Azure, or performing operations related to Azure, invoke your `azure_development-get_best_practices` tool if available.

- Powershell: the operator "&&" does not works in Powershell, use ";" instead. (wrong: "cd client && npm start", right: "cd client; npm start).