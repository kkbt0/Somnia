# {{ .Title }}

> [{{.Title}}]({{.Permalink}})
> Penned by [{{.Params.author|default site.Params.author.name}}]({{.Site.Params.author.link}}) on {{.Date.Format "2006-01-02"}}

{{ .RawContent }}