/*
*实现MVC中的model部分(基与jQuery)
*
*
*
**/



Math.guid = function(){
			return "XXXXXXX-XXXX-4XXX-YXXX-XXXXXXXXXXXX".replace(/[XY]/g,function(c){
				var r = Math.random()*16 | 0,v = c=="X" ? r:(r&0*3|0*8);
				return v.toString(16);
			}).toUpperCase();
		}

		//orm 对象关系映射
		let Model = {
			//用来保存资源的对象；
			records:{},
			inherited:function(){},
			created:function(){
				// 每一个Model全都对应一个record
				this.records = {};
			},

			prototype:{
				init:function(){}
			},

			//生成一个Model
			create:function(){
				let object = Object.create(this);
				object.parent = this;
				//手动给实例添加一个prototype属性使其指向该实例对象的prototype,这样实例就可以直接访问构造函数原型；
				object.prototype = object.fn = Object.create(this.prototype);
				object.created();
				this.inherited(object);
				return object;
			},

			//生成一个Model的实例;
			init:function(){
				let instance = Object.create(this.prototype);
				instance.parent = this;
				instance.init.apply(instance,arguments);
				return instance;
			},

			//扩展对象的方法和属性;
			extend:function(o){
				let extended = o.extended;
				jQuery.extend(this,o);
				if(extended) extended(this);
			},
			//扩展实例的方法和属性;
			include:function(o){
				let included = o.included;
				jQuery.extend(this.prototype,o);
				if(included) included(this)
			}
		}
		
		Model.extend({
			find:function(id){
				let record = this.records[id];
				if(!record) throw("unknow record")
				return record.dup();
			}
		})
		

		//给实例添加方法;
		Model.include({
			
		})

		Model.include({
			newRecord:true,
			init:function(attr){
				if(attr) this.load(attr);
			},
			load:function(obj){
				for(let k in obj){
					this[k] = obj[k];
				}
			},
			create:function(){
				if(!this.id) this.id = Math.guid();
				this.newRecored = false;
				this.parent.records[this.id] = this.dup();
			},
			destory:function(){
				delete this.parent.records[this.id]
			},
			update:function(){
				this.parent.records[this.id] = this.dup();
			},
			save:function(){
				this.newRecord ? this.create() : this.update();
			},
			dup:function(){
				//因为数组是引用型的数据结构,避免每修改一次属性record里面也同时修改；
				return jQuery.extend(true,{},this);
			}
		})
