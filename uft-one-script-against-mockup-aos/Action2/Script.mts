'Comment out this line if you want this action to actually run
ExitAction																					

'Declare variables that will be used in the script
Dim BrowserExecutable, rc, oShell

'Statements to ensure that the OCR service that the AI Object Detection (AIOD) utilizes is running on the machine
Set oShell = CreateObject ("WSCript.shell")
oShell.run "powershell -command ""Start-Service mediaserver"""
Set oShell = Nothing

'Loop to close all open browsers
While Browser("CreationTime:=0").Exist(0)   													
	Browser("CreationTime:=0").Close 
Wend

'Set the BrowserExecutable variable to be the .exe for the browser declared in the datasheet
BrowserExecutable = DataTable.Value("BrowserName") & ".exe"

'Launch the browser specified in the data table
SystemUtil.Run BrowserExecutable,"","","",3												

'Set the variable for what application (in this case the browser) we are acting upon
Set AppContext=Browser("CreationTime:=0")												

'Clear the browser cache to ensure you're getting the latest forms from the application
AppContext.ClearCache																		

'Navigate to the application URL
AppContext.Navigate DataTable.Value("URL")												

'Maximize the application to give the best chance that the fields will be visible on the screen
AppContext.Maximize																		

'Wait for the browser to stop spinning
AppContext.Sync																			

'Tell the AI engine to point at the application
AIUtil.SetContext AppContext																

'===========================================================================================
'BP:  View products from home page
'===========================================================================================
AIUtil.FindTextBlock("Speakers").Click
AIUtil.FindTextBlock("pvantageDEMO").Click

'===========================================================================================
'BP:  Login
'===========================================================================================
AIUtil("profile").Click
rc = AIUtil("input", "Username").Exist
'altnernatively, you could use AIUtil("input", "Username").Highlight
AIUtil("input", "Username").Type "aidemo"
AIUtil("input", "Password").Type "AIdemo1"
AIUtil("button", "Sign In").Click

'===========================================================================================
'BP:  Logout
'===========================================================================================
AIUtil("profile").Click
AIUtil.FindTextBlock("Sign out").Click

'Close the application at the end of your script
AppContext.Close																			
