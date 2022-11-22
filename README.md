# sfdx-custom-metadata-editor README

## Description

The main purpose of this extension is to provide a way to manage your custom metadata records on Salesforce orgs as csv.

## Features

This extension gives you the possibility to export records of your custom metadata in a csv so that you can modify them as if they were data. It also gives you the possibility to import the modified csv, and it will create for you, in the customMetadata folder of your sfdx project, deployable files for your Salesforce org.

## Commands

| Function | Commande Palette                          |
| -------- | ----------------------------------------- |
| Export   | SCME: Export Custom Metadata To CSV       |
| Import   | SCME: Import Custom Metadata From CSV     |
| Refresh  | SCME: Refresh Custom Metadata Definitions |

## How to use it

It is advisable to first extract the custom metadata csv via the export function and work on the generated file.
So that you can use the import function that will create the .md-meta.xml files in the CustomMetadata folder of your Salesforce project.
Files that via the standard deployment functionality you can deploy to your environment.
